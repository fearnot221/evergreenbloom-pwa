import { getSpot, stampSpots } from '../data/stamps';

// shortcut: stamps live in this device's localStorage only; move to the game backend
// (with SSO identity) before launch, and validate keys there, not in the client.
const STAMPS = 'songying-stamps';
const PENDING = 'songying-pending-claim';

export type Claim = { spot: string; key: string };

/** The game runs only as an installed app; `?standalone` lets developers test in a tab. */
export function isStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true ||
    (import.meta.env.DEV && new URLSearchParams(location.search).has('standalone'))
  );
}

/** A claim is valid when the spot exists and the key printed under its QR code matches. */
export function readClaim(params: URLSearchParams): Claim | null {
  const spot = getSpot(params.get('spot'));
  const key = params.get('k')?.trim().toUpperCase();
  return spot && key === spot.key ? { spot: spot.id, key } : null;
}

/** Typed code from the sign under the QR code, e.g. "lake-26" → the lake spot. */
export function claimFromCode(code: string): Claim | null {
  const key = code.trim().toUpperCase();
  const spot = stampSpots.find((candidate) => candidate.key === key);
  return spot ? { spot: spot.id, key } : null;
}

function read<T>(name: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(name) ?? '') as T;
  } catch {
    return fallback;
  }
}

function write(name: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(name);
    else localStorage.setItem(name, JSON.stringify(value));
  } catch {
    // Private mode or full storage: the stamp stays on screen but is not kept.
  }
}

export const stamps = {
  all: () => read<Record<string, string>>(STAMPS, {}),
  add(spot: string) {
    write(STAMPS, { ...stamps.all(), [spot]: new Date().toISOString() });
  },
  pending: () => read<Claim | null>(PENDING, null),
  setPending: (claim: Claim | null) => write(PENDING, claim),
};
