import type { ComponentType } from 'react';
import { createBrowserRouter, type RouteObject, redirect } from 'react-router-dom';
import { isStandalone } from '../game/stamp-store';
import App from './App';
import RouteError from './RouteError';

/** Each page is its own chunk, loaded before the navigation commits. */
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

/** First paint while the initial route chunk loads: a page skeleton. */
function InitialFallback() {
  return (
    <main className="wrap route-loading" aria-busy="true">
      <span className="sr-only">頁面載入中</span>
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line short" />
    </main>
  );
}

export const routes: RouteObject[] = [
  {
    Component: App,
    HydrateFallback: InitialFallback,
    children: [
      {
        errorElement: <RouteError />,
        children: [
          { index: true, loader: ({ request }) => redirect(`/game${new URL(request.url).search}`) },
          { path: 'play', lazy: page(() => import('../pages/PlayPage')) },
          { path: 'game', lazy: page(() => import('../game/GamePage')) },
          // QR codes on site point here: /stamp/<spot>?k=<key>.
          {
            path: 'stamp/:spot',
            loader: ({ params, request }) => {
              const k = new URL(request.url).searchParams.get('k') ?? '';
              const query = new URLSearchParams({ spot: params.spot ?? '', k });
              return redirect(`${isStandalone() ? '/game' : '/play'}?${query}`);
            },
          },
          { path: '*', lazy: page(() => import('../pages/NotFoundPage')) },
        ],
      },
    ],
  },
];

export const createRouter = () => createBrowserRouter(routes);
