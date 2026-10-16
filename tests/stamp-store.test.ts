import { describe, expect, it } from 'vitest';
import { readClaim } from '../src/game/stamp-store';

describe('unverified QR handoff', () => {
  it('parses a known spot and normalizes a key without pretending to verify it', () => {
    expect(readClaim(new URLSearchParams('spot=gate&k=unverified-code'))).toEqual({
      spot: 'gate',
      key: 'UNVERIFIED-CODE',
    });
    expect(readClaim(new URLSearchParams('spot=lake&k=GATE-26'))?.spot).toBe('lake');
  });
  it('rejects malformed handoffs and unknown spots', () => {
    for (const query of ['spot=unknown&k=A', 'spot=lake', 'spot=lake&k=<script>', ''])
      expect(readClaim(new URLSearchParams(query))).toBeNull();
  });
});
