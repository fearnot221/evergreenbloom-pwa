import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRightIcon, CheckIcon, MapTrifoldIcon } from '../components/icons';
import { Page, useDocumentTitle } from '../components/page';
import { websiteHref } from '../data/deployment';
import { display } from '../data/display-copy';
import { mapHref } from '../data/festival';
import { getSpot, methodLabels, type StampSpot, stampSpots } from '../data/stamps';
import { AuthForm } from './AuthForm';
import { ApiError, api, type GameState, savedTime, useAccount } from './api';
import { StampReveal } from './StampReveal';
import { type Claim, isStandalone, readClaim, stamps } from './stamp-store';
import '../styles/pages.css';
import './game.css';

function Challenge({
  spot,
  busy,
  onSubmit,
}: {
  spot: StampSpot;
  busy: boolean;
  onSubmit: (input: { answer?: number; photo?: File }) => Promise<void>;
}) {
  const [answer, setAnswer] = useState<number | null>(null);
  const [consent, setConsent] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  return (
    <section className="challenge" aria-labelledby="challenge-title">
      <p className="note">{methodLabels[spot.method]}</p>
      <h2 id="challenge-title">{spot.name}</h2>
      <p>{spot.task}</p>
      <form
        aria-busy={busy}
        onSubmit={async (event) => {
          event.preventDefault();
          if (spot.method === 'photo') {
            if (photo && consent) await onSubmit({ photo });
          } else await onSubmit(answer === null ? {} : { answer });
        }}
      >
        <fieldset disabled={busy} className="account-fields">
          <legend className="sr-only">完成集章任務</legend>
          {spot.quiz && (
            <>
              <p>{spot.quiz.question}</p>
              {spot.quiz.options.map((option, index) => (
                <label key={option} className="quiz-option">
                  <input
                    type="radio"
                    name="answer"
                    checked={answer === index}
                    onChange={() => setAnswer(index)}
                  />
                  {option}
                </label>
              ))}
            </>
          )}
          {spot.method === 'photo' && (
            <>
              <label className="consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => {
                    setConsent(event.target.checked);
                    setPhoto(null);
                  }}
                />
                我已閱讀隱私說明，同意上傳照片供工作人員審核，並避免拍到他人的臉。
              </label>
              <label htmlFor="stamp-photo">任務照片（JPEG、PNG 或 WebP，上限 3 MB）</label>
              <input
                id="stamp-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                disabled={!consent}
                onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
              />
              <Link className="text-link" to="/play#privacy">
                拍照與隱私說明
              </Link>
            </>
          )}
          <button
            type="submit"
            className="button"
            disabled={
              spot.method === 'quiz'
                ? answer === null
                : spot.method === 'photo'
                  ? !photo || !consent
                  : false
            }
          >
            {busy ? '送出中…' : spot.method === 'photo' ? '上傳並送審' : '送出驗章'}
          </button>
        </fieldset>
      </form>
    </section>
  );
}

export default function GamePage() {
  useDocumentTitle(display.pages.game);
  const [params, setParams] = useSearchParams();
  const [standalone] = useState(isStandalone);
  const account = useAccount();
  const [active, setActive] = useState<Claim | null>(null);
  const [revealed, setRevealed] = useState<StampSpot | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (!standalone) return;
    const claim = readClaim(params) ?? stamps.pending();
    if (claim) setActive(claim);
  }, [params, standalone]);

  if (!standalone)
    return (
      <Page title={display.pages.game} lede="實景集章只在安裝到主畫面的松櫻祭 App 裡進行。">
        <Link className="button" to={`/play?${params}`}>
          看安裝說明
          <ArrowUpRightIcon size={16} aria-hidden="true" />
        </Link>
      </Page>
    );
  const state = account.data;
  const spot = getSpot(active?.spot ?? null);
  const collected = state?.stamps ?? {};
  const failed = (error: unknown) => {
    setError((error as Error).message);
    if (error instanceof ApiError && error.status === 401) account.setData(null);
  };
  return (
    <Page
      title={display.pages.game}
      lede={
        state
          ? '已集 ' +
            Object.keys(collected).length +
            ' / ' +
            stampSpots.length +
            ' 個章。集章、照片審核與兌獎進度以伺服器紀錄為準。'
          : '登入帳號，保存你的集章與兌獎紀錄。'
      }
      className="game"
    >
      <p className="quiz-error" role="alert">
        {account.error || error}
      </p>
      <p role="status">{account.loading ? '正在讀取伺服器紀錄…' : notice}</p>
      {!state && !account.loading && <AuthForm onSuccess={account.setData} />}
      {state && (
        <>
          <div className="actions">
            <span>目前帳號：{state.user.username}</span>
            <button
              className="button button-ghost"
              type="button"
              disabled={busy || account.loading}
              onClick={() => {
                setNotice('');
                setError('');
                void account.refresh();
              }}
            >
              更新紀錄
            </button>
            <button
              className="button button-ghost"
              type="button"
              disabled={busy || account.loading}
              onClick={() => {
                setActive(null);
                setError('');
                setNotice('');
                void account.logout();
              }}
            >
              登出
            </button>
          </div>
          {state.user.role === 'staff' ? (
            <p>
              工作人員帳號不參加兌獎。請前往 <Link to="/staff">審核與核銷</Link>。
            </p>
          ) : (
            <>
              {spot && active && !collected[spot.id] && (
                <Challenge
                  key={spot.id + active.key}
                  spot={spot}
                  busy={busy || account.loading}
                  onSubmit={async (input) => {
                    setBusy(true);
                    setError('');
                    setNotice('');
                    try {
                      if (input.photo && input.photo.size > 3 * 1024 * 1024)
                        throw new Error('照片超過 3 MB，請縮小後重新上傳。');
                      const updated = input.photo
                        ? await api<GameState>(`/claims/${spot.id}/photo`, undefined, {
                            method: 'POST',
                            headers: {
                              'Content-Type': input.photo.type,
                              'X-Stamp-Key': active.key,
                              'X-Photo-Consent': 'yes',
                            },
                            body: input.photo,
                          })
                        : await api<GameState>(`/claims/${spot.id}`, {
                            key: active.key,
                            answer: input.answer,
                          });
                      account.setData(updated);
                      setActive(null);
                      stamps.setPending(null);
                      setParams({}, { replace: true });
                      if (updated.stamps[spot.id]) setRevealed(spot);
                      else setNotice('照片已送出，審核通過後才會集章。請稍後更新紀錄。');
                    } catch (error) {
                      failed(error);
                    } finally {
                      setBusy(false);
                    }
                  }}
                />
              )}
              <form
                className="code-entry"
                aria-busy={busy}
                onSubmit={async (event) => {
                  event.preventDefault();
                  setBusy(true);
                  setError('');
                  setNotice('');
                  try {
                    const found = await api<{ spot: string }>('/resolve', {
                      key: code.trim().toUpperCase(),
                    });
                    if (collected[found.spot]) setNotice('這個章已集過了。');
                    else setActive({ spot: found.spot, key: code.trim().toUpperCase() });
                    setCode('');
                  } catch (error) {
                    failed(error);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <label htmlFor="stamp-code">集章點代碼</label>
                <div className="code-row">
                  <input
                    id="stamp-code"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    maxLength={80}
                    autoCapitalize="characters"
                    autoComplete="off"
                    disabled={busy || account.loading}
                    aria-describedby="stamp-code-help"
                  />
                  <button
                    type="submit"
                    className="button"
                    disabled={busy || account.loading || !code.trim()}
                  >
                    前往
                  </button>
                </div>
                <p className="note" id="stamp-code-help">
                  代碼印在現場 QR Code 下方，由伺服器驗證。舊示範代碼已停用。
                </p>
              </form>
              <ol className="stamp-book" aria-label="集章點">
                {stampSpots.map((item) => {
                  const done = collected[item.id];
                  const photo = state.photos[item.id];
                  return (
                    <li key={item.id} className={`stamp${done ? ' is-done' : ''}`}>
                      <span className="stamp-seal display" aria-hidden="true">
                        {done ? item.name.slice(0, 2) : ''}
                      </span>
                      <div>
                        <h2>{item.name}</h2>
                        <p className="note">
                          {done ? (
                            <>
                              <CheckIcon size={14} aria-hidden="true" /> 已集章
                            </>
                          ) : photo === 'pending' ? (
                            '照片審核中'
                          ) : photo === 'rejected' ? (
                            '照片已退回，請重新掃碼拍攝'
                          ) : (
                            methodLabels[item.method]
                          )}
                        </p>
                        <a className="text-link" href={websiteHref(mapHref(item.locationId))}>
                          <MapTrifoldIcon size={18} aria-hidden="true" />
                          在地圖查看<span className="sr-only">：{item.name}</span>
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <section aria-labelledby="prize-title">
                <h2 id="prize-title">兌獎紀錄</h2>
                {state.redemption ? (
                  <>
                    <p>已兌獎：{savedTime(state.redemption.redeemed_at)}（台北時間）。</p>
                    <p className="note">紀錄編號：{state.redemption.id}。同一帳號不可再次領取。</p>
                  </>
                ) : state.redeemCode ? (
                  <>
                    <p>已集滿全部章。請到兌獎處出示以下代碼，由工作人員核銷。</p>
                    <label htmlFor="redeem-code">兌獎碼</label>
                    <input
                      id="redeem-code"
                      value={state.redeemCode}
                      readOnly
                      className="receipt-code"
                    />
                  </>
                ) : (
                  <p>集滿全部章並通過照片審核後，才會顯示兌獎碼。</p>
                )}
              </section>
            </>
          )}
        </>
      )}
      <p className="note">
        離線時無法驗章或兌獎。清除 Cookie 後可重新登入同一帳號；舊版手機本機集章不會轉成有效章。
      </p>
      <StampReveal spot={revealed} onClose={() => setRevealed(null)} />
    </Page>
  );
}
