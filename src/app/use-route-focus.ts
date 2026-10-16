import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Move focus to the new page's main landmark after a path change. The data router
 * has already loaded the route by the time this runs, so no polling is needed.
 * Scroll position is handled by <ScrollRestoration />.
 */
export function useRouteFocus() {
  const { pathname } = useLocation();
  const first = useRef(true);
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once per path change.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    document.getElementById('route-content')?.focus({ preventScroll: true });
  }, [pathname]);
}
