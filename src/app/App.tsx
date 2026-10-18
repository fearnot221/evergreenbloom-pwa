import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router-dom';
import { WifiSlashIcon } from '../components/icons';
import { Blossom } from '../components/motifs';
import { websiteHref } from '../data/deployment';
import { poster } from '../data/poster-copy';
import { PwaPanel, useOnline } from '../pwa/PwaPanel';
import { useRouteFocus } from './use-route-focus';

export default function App() {
  useRouteFocus();
  const online = useOnline();
  return (
    <div className="app" data-route="page">
      <a className="skip-link" href="#route-content">
        跳至主要內容
      </a>
      <header className="app-header">
        <div className="header-bar">
          <Link className="brand" to="/game" aria-label="松櫻祭 集章冊">
            <span className="brand-emblem" aria-hidden="true">
              <Blossom />
            </span>
            <span className="display brand-word">{poster.wordmark}</span>
          </Link>
          <nav aria-label="遊戲導覽" className="actions">
            <NavLink to="/game">集章冊</NavLink>
            <NavLink to="/play">安裝與說明</NavLink>
            <NavLink to="/staff">工作人員</NavLink>
            <a href={websiteHref()}>活動官網</a>
          </nav>
          <p className="offline-pill" role="status">
            {!online && (
              <>
                <WifiSlashIcon size={16} aria-hidden="true" />
                離線中 · 集章與登入需連線
              </>
            )}
          </p>
        </div>
      </header>
      <div id="route-stage">
        <Outlet />
      </div>
      <ScrollRestoration getKey={(location) => location.pathname + location.search} />
      <footer className="app-footer">
        <div className="wrap">
          <PwaPanel />
          <p className="note">集章遊戲原型，位置與任務待確認。驗章與兌獎需要連線；SSO 尚未串接。</p>
          <a href={websiteHref()}>返回活動官網</a>
        </div>
      </footer>
    </div>
  );
}
