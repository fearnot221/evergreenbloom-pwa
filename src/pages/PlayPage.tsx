import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Ink } from '../components/Ink';
import { ArrowUpRightIcon, ExportIcon, PlusSquareIcon } from '../components/icons';
import { Page, useDocumentTitle } from '../components/page';
import { websiteHref } from '../data/deployment';
import { display } from '../data/display-copy';
import { getSpot, methodLabels, stampSpots } from '../data/stamps';
import { isStandalone, readClaim, stamps } from '../game/stamp-store';
import { gsap, MOTION, stamp, useGSAP } from '../motion/gsap';
import { useInstallPrompt } from '../pwa/PwaPanel';
import '../styles/pages.css';

/**
 * Point the install at `/game?spot=…` so the app opens on the stamp just scanned.
 * iOS keeps home-screen storage apart from Safari, so the URL is the only carrier there.
 */
function useInstallStartUrl(startUrl: string | null) {
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    if (!startUrl || !link) return;
    const original = link.href;
    let blob = '';
    let cancelled = false;
    const abs = (url: string) => new URL(url, location.origin).href;
    fetch(original)
      .then((response) => response.json())
      .then((manifest) => {
        // Left the page (or the claim changed) before the fetch came back: do nothing.
        if (cancelled) return;
        // A blob manifest resolves relative URLs against itself, so make them absolute.
        manifest.id = abs(manifest.id);
        manifest.scope = abs(manifest.scope);
        manifest.start_url = abs(startUrl);
        for (const item of [...manifest.icons, ...manifest.shortcuts]) {
          if (item.src) item.src = abs(item.src);
          if (item.url) item.url = abs(item.url);
        }
        blob = URL.createObjectURL(
          new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' }),
        );
        link.href = blob;
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      link.href = original;
      if (blob) URL.revokeObjectURL(blob);
    };
  }, [startUrl]);
}

const methods = [
  {
    id: 'qr',
    text: '到集章點掃描 QR Code。QR Code 下方印有代碼，掃描不順時可直接在 App 輸入。',
  },
  { id: 'quiz', text: '讀完現場的說明，回答一題選擇題。答案都寫在說明裡，不會找不到。' },
  { id: 'photo', text: '在定點拍下指定的東西。集章成功後會出現這個地點的介紹。' },
] as const;

const signIns = [
  ['Portal', '校內教職員生，使用學校帳號'],
  ['Google', '校外參與者'],
  ['LINE', '校外參與者'],
] as const;

export default function PlayPage() {
  useDocumentTitle(display.pages.play);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const list = document.querySelector('.seal-methods');
      if (list) stamp(gsap.utils.toArray('.seal-methods .seal'), list);
    });
    return () => mm.revert();
  });
  const [params] = useSearchParams();
  const claim = readClaim(params);
  const spot = getSpot(claim?.spot ?? null);
  const [standalone] = useState(isStandalone);
  const install = useInstallPrompt();

  // Android and desktop share storage with the installed app; keep the claim for it.
  useEffect(() => {
    const saved = readClaim(params);
    if (saved) stamps.setPending(saved);
  }, [params]);
  useInstallStartUrl(claim ? `/game?spot=${claim.spot}&k=${claim.key}` : null);

  return (
    <Page
      title={display.pages.play}
      lede="第二屆的大地遊戲是走遍校園的實景集章。集章只在安裝到手機主畫面的松櫻祭 App 裡進行；這一頁說明怎麼安裝與開始。"
      className="play"
    >
      {spot && claim && (
        <section className="claim" aria-labelledby="claim-title">
          <h2 id="claim-title">已記下「{spot.name}」</h2>
          <p>
            安裝後打開 App，這個集章點會自動帶入，不用再掃一次。如果沒有出現，在集章冊輸入代碼{' '}
            <strong className="latin">{claim.key}</strong>。
          </p>
        </section>
      )}

      {standalone ? (
        <Link className="button" to="/game">
          打開集章冊
          <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
        </Link>
      ) : (
        <section aria-labelledby="install-title">
          <h2 className="display section-title" id="install-title" data-ink>
            <Ink text={display.sections.install} />
          </h2>
          <ol className="rows install-steps">
            <li>
              <h3>iPhone、iPad</h3>
              <p>
                用 Safari 開啟本頁，點分享
                <ExportIcon size={18} aria-label="分享圖示" />
                ，選「加入主畫面」
                <PlusSquareIcon size={18} aria-label="加入主畫面圖示" />
                ，再從主畫面打開松櫻祭。
              </p>
            </li>
            <li>
              <h3>Android</h3>
              <p>用 Chrome 開啟本頁，點右上選單，選「安裝應用程式」或「加到主畫面」。</p>
            </li>
          </ol>
          {install && (
            <button type="button" className="button" onClick={install}>
              安裝松櫻祭 App
            </button>
          )}
        </section>
      )}

      <section aria-labelledby="how-title">
        <h2 className="display section-title" id="how-title" data-ink>
          <Ink text={display.sections.howStamp} />
        </h2>
        {/* 印章: the three ways to collect, each pressed on as a seal. */}
        <ol className="seal-methods">
          {methods.map((method) => (
            <li key={method.id}>
              <span className="display seal" aria-hidden="true">
                {display.flows.seals[method.id]}
              </span>
              <h3>{methodLabels[method.id]}</h3>
              <p>{method.text}</p>
            </li>
          ))}
        </ol>
        <p className="note">
          目前規劃 {stampSpots.length} 個示範集章點，位置與題目待團隊確認。集章點會標在
          <a className="text-link" href={websiteHref('map')}>
            校園地圖
          </a>
          上。
        </p>
      </section>

      <section aria-labelledby="signin-title">
        <h2 className="display section-title" id="signin-title" data-ink>
          <Ink text={display.sections.signIn} />
        </h2>
        <p>登入只在 App 裡進行，官網不需要也不提供登入。預計支援：</p>
        <dl className="rows info-rows">
          {signIns.map(([name, who]) => (
            <div key={name}>
              <dt className="latin">{name}</dt>
              <dd>{who}</dd>
            </div>
          ))}
        </dl>
        <p className="note">登入服務尚未開放。開放前，集章紀錄只存在你的手機上。</p>
      </section>

      <section id="privacy" aria-labelledby="privacy-title">
        <h2 className="display section-title" id="privacy-title" data-ink>
          <Ink text={display.sections.privacy} />
        </h2>
        <ul className="rows">
          <li>照片只用來確認你完成了集章任務，不會用於其他用途或公開。</li>
          <li>請拍指定的物件或集章牌，避免拍到其他人的臉。</li>
          <li>如果照片裡不小心拍到人，該照片只供集章確認，不會另作使用。</li>
          <li>目前的版本不會上傳照片；照片留在你的手機上。</li>
        </ul>
        <p className="note">正式隱私權政策待主辦單位確認後公布。</p>
      </section>
    </Page>
  );
}
