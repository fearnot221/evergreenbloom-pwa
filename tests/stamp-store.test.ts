import { describe, expect, it } from 'vitest';
import { claimFromCode, readClaim } from '../src/game/stamp-store';

describe('stamp claims', () => {
  it('accepts a spot with its own key, case-insensitively', () => {
    expect(readClaim(new URLSearchParams('spot=gate&k=gate-26'))).toEqual({
      spot: 'gate',
      key: 'GATE-26',
    });
  });

  it('rejects unknown spots and mismatched keys', () => {
    expect(readClaim(new URLSearchParams('spot=nowhere&k=GATE-26'))).toBeNull();
    expect(readClaim(new URLSearchParams('spot=lake&k=GATE-26'))).toBeNull();
    expect(readClaim(new URLSearchParams(''))).toBeNull();
  });

  it('finds a spot from the code printed under its QR code', () => {
    expect(claimFromCode(' book-26 ')?.spot).toBe('library');
    expect(claimFromCode('nope')).toBeNull();
  });
});
