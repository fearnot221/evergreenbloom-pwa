import { describe, expect, it } from 'vitest';
import { getEvent, getLocation, officialTopics, snapshot } from '../src/data/festival';

const unique = (ids: string[]) => new Set(ids).size === ids.length;

describe('content snapshot', () => {
  it('uses unique ids per collection', () => {
    expect(unique(snapshot.events.map((e) => e.id))).toBe(true);
    expect(unique(snapshot.program.map((p) => p.id))).toBe(true);
    expect(unique(snapshot.locations.map((l) => l.id))).toBe(true);
    expect(unique(snapshot.announcements.map((a) => a.id))).toBe(true);
  });

  it('resolves every event and program reference', () => {
    for (const event of snapshot.events) expect(getLocation(event.locationId)).toBeDefined();
    for (const entry of snapshot.program) {
      expect(getEvent(entry.eventId)).toBeDefined();
      expect(getLocation(entry.locationId)).toBeDefined();
      expect(entry.start < entry.end).toBe(true);
    }
  });

  it('publishes each official topic as a sourced, undated announcement', () => {
    for (const topic of officialTopics) {
      const item = snapshot.announcements.find((a) => a.id === topic.id);
      expect(item?.title).toBe(topic.title);
      expect(item?.publishedAt).toBeNull();
      expect(item?.source).toMatch(/官方社群/);
      expect(topic.lines.join('')).toBe(topic.title);
    }
  });

  it('keeps fictional events labelled as prototype data', () => {
    for (const event of snapshot.events) expect(event.status).toBe('prototype');
  });
});
