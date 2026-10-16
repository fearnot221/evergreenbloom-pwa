import { getSpot } from '../data/stamps';

const PENDING = 'songying-pending-claim';
export type Claim = { spot: string; key: string };

export function isStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true ||
    (import.meta.env.DEV && new URLSearchParams(location.search).has('standalone'))
  );
}

/** Only parse the handoff; the server alone decides whether this key is valid. */
export function readClaim(params: URLSearchParams): Claim | null {
  const spot = getSpot(params.get('spot'));
  const key = params.get('k')?.trim().toUpperCase();
  return spot && key && /^[A-Z0-9-]{1,80}$/.test(key) ? { spot: spot.id, key } : null;
}

export const stamps = {
  pending(): Claim | null {
    try {
      const value = JSON.parse(localStorage.getItem(PENDING) ?? '');
      if (typeof value?.spot !== 'string' || typeof value?.key !== 'string') return null;
      return readClaim(new URLSearchParams({ spot: value.spot, k: value.key }));
    } catch {
      return null;
    }
  },
  setPending(claim: Claim | null) {
    try {
      if (claim) localStorage.setItem(PENDING, JSON.stringify(claim));
      else localStorage.removeItem(PENDING);
    } catch {
      /* The printed code remains the fallback when storage is unavailable. */
    }
  },
};
