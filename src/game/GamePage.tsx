import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Ink } from '../components/Ink';
import { ArrowUpRightIcon, CameraIcon, CheckIcon, MapTrifoldIcon } from '../components/icons';
import { Page, useDocumentTitle } from '../components/page';
import { websiteHref } from '../data/deployment';
import { display } from '../data/display-copy';
import { mapHref } from '../data/festival';
import { getSpot, methodLabels, type StampSpot, stampSpots } from '../data/stamps';
import { StampReveal } from './StampReveal';
import { type Claim, claimFromCode, isStandalone, readClaim, stamps } from './stamp-store';
import '../styles/pages.css';
import './game.css';

/** The challenge for one spot. Calls `onDone` only when the task is actually met. */
function Challenge({ spot, onDone }: { spot: StampSpot; onDone: () => void }) {
  const [choice, setChoice] = useState<number | null>(null);
  const [wrong, setWrong] = useState(false);
  const [consent, setConsent] = useState(false);

  return (
    <section className="challenge" aria-labelledby="challenge-title">
      <p className="note">{methodLabels[spot.method]}</p>
      <h2 id="challenge-title">{spot.name}</h2>
      <p>{spot.task}</p>

      {spot.method === 'qr' && (
        <button type="button" className="button" onClick={onDone}>
          蓋章
        </button>
      )}

      {spot.method === 'quiz' && spot.quiz && (
        <form
          className="quiz"
          onSubmit={(event) => {
            event.preventDefault();
            if (choice === spot.quiz?.answer) onDone();
            else setWrong(true);
          }}
        >
          <fieldset>
            <legend>{spot.quiz.question}</legend>
            {spot.quiz.options.map((option, index) => (
              <label key={option} className="quiz-option">
                <input
                  type="radio"
                  name="answer"
                  checked={choice === index}
                  onChange={() => {
                    setChoice(index);
                    setWrong(false);
                  }}
                />
                {option}
              </label>
            ))}
          </fieldset>
          <p className="quiz-error" role="alert">
            {wrong ? '再讀一次說明牌，答案就在上面。' : ''}
          </p>
          <button type="submit" className="button" disabled={choice === null}>
            送出答案
          </button>
        </form>
      )}

      {spot.method === 'photo' && (
        <div className="photo-task">
          <label className="consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            我已閱讀拍照與隱私說明，並避免拍到他人的臉。
          </label>
          <label className={`button${consent ? '' : ' is-disabled'}`}>
            <CameraIcon size={18} weight="bold" aria-hidden="true" />
            拍照集章
            {/* shortcut: the photo is only checked for presence and never leaves the
                device; upload and review need the game backend. */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              disabled={!consent}
              onChange={(event) => {
                if (event.target.files?.length) onDone();
              }}
            />
          </label>
          <Link className="text-link" to="/play#privacy">
            拍照與隱私說明
          </Link>
        </div>
      )}
    </section>
  );
}

/** Only rendered inside the installed app; a browser tab is sent to the install guide. */
export default function GamePage() {
  useDocumentTitle(display.pages.game);
  const [params, setParams] = useSearchParams();
  const [standalone] = useState(isStandalone);
  const [collected, setCollected] = useState(stamps.all);
  const [active, setActive] = useState<Claim | null>(null);
  const [revealed, setRevealed] = useState<StampSpot | null>(null);
  const [code, setCode] = useState('');
  // What the code line says: the hint, an unknown code, or an already-collected spot.
  const [codeNote, setCodeNote] = useState<'hint' | 'unknown' | 'collected'>('hint');

  // A QR link (?spot=&k=) or a claim saved before installing opens its challenge.
  useEffect(() => {
    if (!standalone) return;
    const claim = readClaim(params) ?? stamps.pending();
    if (claim) setActive(claim);
    stamps.setPending(null);
  }, [params, standalone]);

  if (!standalone) {
    return (
      <Page title={display.pages.game} lede="實景集章只在安裝到主畫面的松櫻祭 App 裡進行。">
        <Link className="button" to={`/play?${params}`}>
          看安裝說明
          <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
        </Link>
      </Page>
    );
  }

  const spot = getSpot(active?.spot ?? null);
  const finish = () => {
    if (!spot) return;
    stamps.add(spot.id);
    setCollected(stamps.all());
    setActive(null);
    setParams({}, { replace: true });
    setRevealed(spot);
  };

  return (
    <Page
      title={display.pages.game}
      lede={`已集 ${Object.keys(collected).length} / ${stampSpots.length} 個章。到集章點掃描 QR Code，或輸入牌子上的代碼。`}
      className="game"
    >
      {spot && !collected[spot.id] && <Challenge key={spot.id} spot={spot} onDone={finish} />}

      <form
        className="code-entry"
        onSubmit={(event) => {
          event.preventDefault();
          const claim = claimFromCode(code);
          if (!claim) return setCodeNote('unknown');
          setCode('');
          if (collected[claim.spot]) return setCodeNote('collected');
          setCodeNote('hint');
          setActive(claim);
        }}
      >
        <label htmlFor="stamp-code">集章點代碼</label>
        <div className="code-row">
          <input
            id="stamp-code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            autoCapitalize="characters"
            autoComplete="off"
            aria-describedby="stamp-code-help"
            aria-invalid={codeNote === 'unknown'}
          />
          <button type="submit" className="button" disabled={!code.trim()}>
            前往
          </button>
        </div>
        <p
          id="stamp-code-help"
          className={codeNote === 'unknown' ? 'quiz-error' : 'note'}
          role="status"
        >
          {
            {
              hint: '代碼印在 QR Code 下方。',
              unknown: '找不到這個代碼，請對照 QR Code 下方的文字。',
              collected: '這個章已經集過了，看看下面的集章冊。',
            }[codeNote]
          }
        </p>
      </form>

      <ol className="stamp-book" aria-label="集章點">
        {stampSpots.map((item) => {
          const done = collected[item.id];
          return (
            <li key={item.id} className={done ? 'stamp is-done' : 'stamp'}>
              <span className="stamp-seal display" aria-hidden="true">
                {done ? item.name.slice(0, 2) : ''}
              </span>
              <div>
                <h2>{item.name}</h2>
                <p className="note">
                  {done ? (
                    <>
                      <CheckIcon size={14} weight="bold" aria-hidden="true" /> 已集章
                    </>
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

      <section aria-labelledby="sign-in-title">
        <h2 className="display section-title" id="sign-in-title" data-ink>
          <Ink text={display.sections.signIn} />
        </h2>
        <p className="note">
          登入服務尚未開放。在那之前，集章只存在這支手機上；清除瀏覽資料會一併清除集章紀錄。
        </p>
      </section>

      <StampReveal spot={revealed} onClose={() => setRevealed(null)} />
    </Page>
  );
}
