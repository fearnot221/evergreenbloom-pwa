import { useCallback, useEffect, useState } from 'react';
import { Page, useDocumentTitle } from '../components/page';
import { AuthForm } from './AuthForm';
import { ApiError, api, type Receipt, savedTime, useAccount } from './api';
import '../styles/pages.css';
import './game.css';

type Photo = { id: string; spot_id: string; submitted_at: string; username: string };
type Lookup = { username: string; complete: boolean; redemption: Receipt | null };
type Record = Receipt & { username: string; stamp_count: number };

function PhotoPreview({ id }: { id: string }) {
  const [src, setSrc] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    let url = '';
    fetch(`/api/staff/photos/${id}`, {
      credentials: 'same-origin',
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('照片無法載入，請更新清單。');
        const blob = await response.blob();
        if (controller.signal.aborted) return;
        url = URL.createObjectURL(blob);
        setSrc(url);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      });
    return () => {
      controller.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [id]);
  return (
    <>
      {src && <img className="review-photo" src={src} alt="參加者上傳的待審核任務照片" />}
      <p role="status">{error || (!src ? '正在載入照片…' : '')}</p>
    </>
  );
}

export default function StaffPage() {
  useDocumentTitle('審核與兌獎');
  const account = useAccount();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [code, setCode] = useState('');
  const [lookup, setLookup] = useState<Lookup | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const refresh = useCallback(async () => {
    const [photos, records] = await Promise.all([
      api<Photo[]>('/staff/photos'),
      api<Record[]>('/staff/redemptions'),
    ]);
    setPhotos(photos);
    setRecords(records);
  }, []);
  const role = account.data?.user.role;
  useEffect(() => {
    if (role === 'staff') refresh().catch((error) => setError(error.message));
    else {
      setPhotos([]);
      setRecords([]);
      setLookup(null);
      setCode('');
    }
  }, [role, refresh]);
  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await action();
    } catch (error) {
      setError((error as Error).message);
      setLookup(null);
      if (error instanceof ApiError && error.status === 401) account.setData(null);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Page
      plainTitle="審核與兌獎"
      lede="工作人員登入後可審核任務照片、核銷兌獎碼與查閱兌獎紀錄。"
      className="game"
    >
      <p className="quiz-error" role="alert">
        {account.error || error}
      </p>
      <p role="status">{account.loading ? '正在確認帳號…' : busy ? '處理中…' : notice}</p>
      {!account.data && !account.loading && <AuthForm staff onSuccess={account.setData} />}
      {account.data && (
        <>
          <div className="actions">
            <span>目前帳號：{account.data.user.username}</span>
            <button
              className="button button-ghost"
              type="button"
              disabled={busy || account.loading}
              onClick={() => {
                setError('');
                setNotice('');
                void account.logout();
              }}
            >
              登出
            </button>
          </div>
          {role !== 'staff' ? (
            <p>此帳號沒有工作人員權限，請登出後使用工作人員帳號登入。</p>
          ) : (
            <>
              <button
                className="button button-ghost"
                type="button"
                disabled={busy || account.loading}
                onClick={() => void run(refresh)}
              >
                更新照片與紀錄
              </button>
              <section aria-labelledby="review-title">
                <h2 id="review-title">待審核照片</h2>
                <p className="note">
                  核對指定任務後再通過。照片會在通過或退回時移除，只保留審核紀錄。每次最多顯示最早
                  100 筆。
                </p>
                {photos.length === 0 && <p>目前沒有待審核照片。</p>}
                <ul className="rows">
                  {photos.map((photo) => (
                    <li key={photo.id}>
                      <h3>
                        {photo.username} · {photo.spot_id}
                      </h3>
                      <p className="note">{savedTime(photo.submitted_at)}（台北時間）</p>
                      <PhotoPreview id={photo.id} />
                      <div className="actions">
                        {[true, false].map((approve) => (
                          <button
                            key={String(approve)}
                            type="button"
                            className={`button${approve ? '' : ' button-ghost'}`}
                            disabled={busy || account.loading}
                            onClick={() =>
                              void run(async () => {
                                await api(`/staff/photos/${photo.id}`, { approve });
                                setNotice(approve ? '照片已通過，伺服器已發章。' : '照片已退回。');
                                await refresh();
                              })
                            }
                          >
                            {approve ? '通過並發章' : '退回重拍'}
                          </button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
              <section aria-labelledby="redeem-title">
                <h2 id="redeem-title">兌獎核銷</h2>
                <form
                  className="code-entry"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void run(async () =>
                      setLookup(
                        await api<Lookup>('/staff/lookup', { code: code.trim().toUpperCase() }),
                      ),
                    );
                  }}
                >
                  <label htmlFor="staff-code">參加者出示的兌獎碼</label>
                  <div className="code-row">
                    <input
                      id="staff-code"
                      value={code}
                      onChange={(event) => {
                        setCode(event.target.value);
                        setLookup(null);
                      }}
                      autoComplete="off"
                      autoCapitalize="characters"
                      maxLength={24}
                      required
                      disabled={busy || account.loading}
                    />
                    <button
                      className="button"
                      type="submit"
                      disabled={busy || account.loading || !code.trim()}
                    >
                      查詢資格
                    </button>
                  </div>
                </form>
                {lookup && (
                  <div>
                    <p>參加者帳號：{lookup.username}</p>
                    <p>
                      {lookup.redemption
                        ? '此帳號已兌獎，不可重複領取。'
                        : lookup.complete
                          ? '已集滿全部章，可兌獎。'
                          : '尚未集滿全部章，無法兌獎。'}
                    </p>
                    {lookup.redemption && (
                      <p className="note">
                        兌獎時間：{savedTime(lookup.redemption.redeemed_at)}（台北時間）；紀錄編號：
                        {lookup.redemption.id}
                      </p>
                    )}
                    <button
                      className="button"
                      type="button"
                      disabled={busy || account.loading || !lookup.complete || !!lookup.redemption}
                      onClick={() =>
                        void run(async () => {
                          const receipt = await api<Record>('/staff/redeem', {
                            code: code.trim().toUpperCase(),
                          });
                          setLookup({ ...lookup, redemption: receipt });
                          setNotice('兌獎已記錄，請勿重複發放。');
                          await refresh();
                        })
                      }
                    >
                      確認發放獎品並記錄兌獎
                    </button>
                  </div>
                )}
              </section>
              <section aria-labelledby="records-title">
                <h2 id="records-title">最近 100 筆兌獎紀錄</h2>
                {records.length === 0 && <p>尚無兌獎紀錄。</p>}
                <ul className="rows">
                  {records.map((record) => (
                    <li key={record.id}>
                      <h3>{record.username}</h3>
                      <p>
                        {savedTime(record.redeemed_at)}（台北時間） · 核銷帳號：{record.reviewer}
                      </p>
                      <p className="note">
                        編號：{record.id} · {record.stamp_count} 個章
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </>
      )}
    </Page>
  );
}
