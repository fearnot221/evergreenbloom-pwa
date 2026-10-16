import { useEffect } from 'react';
import { Page } from '../components/page';
import { display } from '../data/display-copy';
import '../styles/pages.css';

/** Shown when a route chunk fails to load (offline, unsaved) or a page throws. */
export default function RouteError() {
  useEffect(() => {
    document.title = `${display.pages.error} · 松櫻祭`;
  }, []);
  return (
    <Page
      title={display.pages.error}
      lede="可能是連線中斷，或這一頁尚未儲存為離線內容。請恢復連線後重新開啟。"
      className="route-error"
    >
      <p className="actions">
        <a className="button" href={window.location.href}>
          重新載入
        </a>
        <a className="button button-ghost" href="/game">
          開啟集章冊
        </a>
      </p>
    </Page>
  );
}
