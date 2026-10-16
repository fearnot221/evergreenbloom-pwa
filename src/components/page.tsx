import { type ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  categories,
  days,
  getLocation,
  mapHref,
  prototypeNotice,
  snapshot,
} from '../data/festival';
import type { Event } from '../data/model';
import { poster } from '../data/poster-copy';
import { Ink } from './Ink';
import { ArrowUpRightIcon, InfoIcon, MapTrifoldIcon } from './icons';
import { Blossom } from './motifs';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · 松櫻祭` : '松櫻祭 · 國立中央大學第二屆春日祭典';
  }, [title]);
}

/**
 * Inner-page layout: a sakura header band with the title and lede, then the content.
 * Behind the lede, three outlined columns of the title flow in opposite directions
 * (直書逆走, ui.fearnot.tw 10). `title` must come from display-copy so the display
 * subset covers it; dynamic titles (events, announcements) use the body face via
 * `plainTitle` and get no columns.
 */
export function Page({
  title,
  plainTitle,
  lede,
  className = '',
  children,
}: {
  title?: string;
  plainTitle?: string;
  lede?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <main id="route-content" tabIndex={-1} className={`page ${className}`}>
      <header className="page-head">
        <div className="wrap page-head-grid">
          <h1 className={title ? 'display page-title' : 'page-title is-plain'}>
            {title ? <Ink text={title} /> : plainTitle}
          </h1>
          {lede && <p className="page-lede">{lede}</p>}
        </div>
        {title && (
          <div className="display head-flow" aria-hidden="true">
            {[0, 1, 2].map((column) => (
              <p className="head-flow-col" key={column}>
                {/* Two identical halves make the -50% loop seamless. */}
                <span>{`${title}・`.repeat(6)}</span>
                <span>{`${title}・`.repeat(6)}</span>
              </p>
            ))}
          </div>
        )}
      </header>
      <div className="wrap page-body">{children}</div>
    </main>
  );
}

export function PrototypeNotice({ children = prototypeNotice }: { children?: ReactNode }) {
  return (
    <p className="notice">
      <InfoIcon size={16} weight="bold" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export function MapLink({ locationId, label }: { locationId: string; label: string }) {
  return (
    <Link className="text-link" to={mapHref(locationId)}>
      <MapTrifoldIcon size={18} aria-hidden="true" />
      在地圖查看<span className="sr-only">：{label}</span>
    </Link>
  );
}

/** First fictional time slot for an event, for ticket stubs. */
function firstSlot(eventId: string) {
  const slot = snapshot.program.find((entry) => entry.eventId === eventId);
  if (!slot) return null;
  return { day: days.find((d) => d.id === slot.dayId)?.label ?? '', start: slot.start };
}

/** An event as a card: category and first time slot above the title. */
export function Ticket({ event }: { event: Event }) {
  const slot = firstSlot(event.id);
  const location = getLocation(event.locationId);
  return (
    <article className="event-card">
      <p className="event-meta">
        <span className="event-tag">{categories[event.category]}</span>
        {slot && (
          <span className="num">
            {slot.day} {slot.start}
          </span>
        )}
      </p>
      <h3 className="event-title">
        <Link to={`/events/${event.id}`}>{event.title}</Link>
      </h3>
      <p>{event.summary}</p>
      <p className="note">{location?.name} · 虛構示範</p>
      <MapLink locationId={event.locationId} label={event.title} />
    </article>
  );
}

/** The official announcements as poster cards set in the post's own lettering. */
export function AnnouncementCards() {
  return (
    <ul className="announce-cards">
      {Object.entries(poster.topics).map(([id, lines]) => (
        <li key={id}>
          <Link className="announce-card" to={`/news/${id}`}>
            <span className="display announce-card-title">
              {lines.map((line) => (
                <span className="line" key={line}>
                  {line}
                </span>
              ))}
            </span>
            <span className="announce-card-cta">
              閱讀公告
              <ArrowUpRightIcon size={14} weight="bold" aria-hidden="true" />
            </span>
            <Blossom className="announce-card-art" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export const featuredEvents = snapshot.events.filter((event) => event.featured);
