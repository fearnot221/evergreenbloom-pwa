import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import GamePage from '../src/game/GamePage';
import PlayPage from '../src/pages/PlayPage';

function render(url: string) {
  return renderToString(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/play" element={<PlayPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('game app', () => {
  for (const path of ['/play', '/game']) {
    it(`${path} has an accessible page landmark and heading`, () => {
      const html = render(path);
      expect(html.match(/<main /g)).toHaveLength(1);
      expect(html.match(/<h1/g)).toHaveLength(1);
    });
  }
  it('preserves the scanned claim in the install guide', () => {
    const html = render('/play?spot=lake&k=lake-26').replaceAll('<!-- -->', '');
    expect(html).toContain('已記下「中大湖」');
    expect(html).toContain('LAKE-26');
    expect(html).toContain('https://fearnot221.github.io/evergreenbloom/map');
  });
  it('does not accept a claim with a mismatched key', () => {
    expect(render('/play?spot=lake&k=GATE-26')).not.toContain('已記下');
  });
  it('keeps the game in the installed app', () => {
    expect(render('/game')).toContain('只在安裝到主畫面');
  });
});
