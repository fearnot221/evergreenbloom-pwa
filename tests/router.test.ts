import { describe, expect, it } from 'vitest';
import { routes } from '../src/app/router';

describe('game routes', () => {
  it('owns only the game, install guide, QR entry and not-found page', () => {
    const paths = routes[0].children?.[0].children?.map((route) =>
      route.index ? '/' : route.path,
    );
    expect(paths).toEqual(['/', 'play', 'game', 'stamp/:spot', '*']);
  });
  it('forwards a QR claim to the install guide in a browser tab', async () => {
    const route = routes[0].children?.[0].children?.find((route) => route.path === 'stamp/:spot');
    if (typeof route?.loader !== 'function') throw new Error('Missing QR loader');
    const response = await route.loader({
      params: { spot: 'lake' },
      context: {},
      request: new Request('https://game.example/stamp/lake?k=LAKE-26'),
    });
    expect((response as Response).headers.get('Location')).toBe('/play?spot=lake&k=LAKE-26');
  });
});
