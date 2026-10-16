import { Link } from 'react-router-dom';
import { Page, useDocumentTitle } from '../components/page';
import { websiteHref } from '../data/deployment';
import { display } from '../data/display-copy';
import '../styles/pages.css';

export default function NotFoundPage({ what = '這一頁' }: { what?: string }) {
  useDocumentTitle('找不到頁面');
  return (
    <Page
      title={display.pages.notFound}
      lede={`找不到${what}。內容可能尚未收錄於這個版本，或網址有誤。`}
      className="not-found"
    >
      {/* 殘影: the question drifts with three fading echoes behind it, a little lost. */}
      <p className="display echo" aria-hidden="true">
        {[0, 1, 2, 3].map((layer) => (
          <span key={layer} style={{ '--layer': layer } as React.CSSProperties}>
            {display.pages.notFound}
          </span>
        ))}
      </p>
      <p className="actions">
        <Link className="button" to="/game">
          回到集章冊
        </Link>
        <a className="button button-ghost" href={websiteHref()}>
          活動官網
        </a>
      </p>
    </Page>
  );
}
