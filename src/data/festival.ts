import campusLocations from './campus-locations.json';
import { festival as story } from './content';
import type { Category, ContentSnapshot, Location } from './model';
export const categories: Record<Category, string> = {
  special: '特別企劃',
  performance: '演出',
  market: '市集',
  activity: '活動',
};
export const days = [
  { id: 'demo-a', label: '測試日 A' },
  { id: 'demo-b', label: '測試日 B' },
];
export const prototypeNotice =
  '以下為虛構的測試資料，不是第二屆的節目、日期或場地公告，請勿用於安排參與。';
/**
 * Topics visible on the second-edition social posts the user supplied on 2026-10-16.
 * Only the topic itself is confirmed; dates, places and terms are not on the posts.
 */
const socialSource = '來源：第二屆松櫻祭官方社群貼文（使用者提供之截圖，2026-10-16）';
export const officialTopics = [
  {
    id: 'briefing',
    title: '活動說明會',
    lines: ['活動', '說明會'],
    summary: '第二屆松櫻祭將舉辦活動說明會。',
    body: '官方社群已公告「活動說明會」。舉辦日期、地點與報名方式未包含在本站取得的資料中，請以官方社群公告為準。',
  },
  {
    id: 'crew-recruitment',
    title: '工人招募',
    lines: ['工人', '招募'],
    summary: '第二屆松櫻祭正在招募工作人員。',
    body: '官方社群已公告「工人招募」。招募組別、名額與報名期限未包含在本站取得的資料中，請以官方社群公告為準。',
  },
  {
    id: 'partner-shops',
    title: '特約商店',
    lines: ['特約', '商店'],
    summary: '第二屆松櫻祭的特約商店資訊。',
    body: '官方社群已公告「特約商店」。合作店家名單與優惠內容未包含在本站取得的資料中，請以官方社群公告為準。',
  },
] as const;

export const snapshot: ContentSnapshot = {
  revision: 'prototype-2026-10-16.1',
  updatedAt: '2026-10-16',
  editionId: 'upcoming-tbd',
  events: [
    {
      id: 'sound-study',
      editionId: 'upcoming-tbd',
      title: '聲音，在春天集合',
      category: 'performance',
      summary: '演出資訊的閱讀與場地連結示範。',
      description: '測試一場演出如何連接節目表與場地。演出者、參與方式與正式內容均待確認。',
      status: 'prototype',
      locationId: 'demo-stage',
      featured: true,
    },
    {
      id: 'market-study',
      editionId: 'upcoming-tbd',
      title: '把創意，帶到一起',
      category: 'market',
      summary: '市集探索與攤位資訊的結構示範。',
      description: '這是市集內容型態的測試，不代表已確認的攤商、營業時段或活動。',
      status: 'prototype',
      locationId: 'demo-market',
      featured: true,
    },
    {
      id: 'lake-study',
      editionId: 'upcoming-tbd',
      title: '走進一個春天',
      category: 'activity',
      summary: '校園活動與地點選取的互動示範。',
      description:
        '透過中大湖區域參考點測試活動到地圖的流程。活動仍是虛構示範，並非已確認場地或入口。',
      status: 'prototype',
      locationId: 'lake-plaza',
      featured: true,
    },
    {
      id: 'gather-study',
      editionId: 'upcoming-tbd',
      title: '從這裡，展開',
      category: 'special',
      summary: '特別企劃與多時段活動的測試。',
      description: '特別企劃的版型示例。實際企劃、名額與報名方式尚未確認。',
      status: 'prototype',
      locationId: 'lake-plaza',
      featured: false,
    },
  ],
  program: [
    {
      id: 'p1',
      eventId: 'lake-study',
      locationId: 'lake-plaza',
      dayId: 'demo-a',
      start: '11:00',
      end: '12:00',
      status: 'prototype',
    },
    {
      id: 'p2',
      eventId: 'market-study',
      locationId: 'demo-market',
      dayId: 'demo-a',
      start: '12:00',
      end: '17:00',
      status: 'prototype',
    },
    {
      id: 'p3',
      eventId: 'sound-study',
      locationId: 'demo-stage',
      dayId: 'demo-a',
      start: '14:00',
      end: '15:00',
      status: 'prototype',
    },
    {
      id: 'p4',
      eventId: 'gather-study',
      locationId: 'lake-plaza',
      dayId: 'demo-b',
      start: '10:30',
      end: '11:30',
      status: 'prototype',
    },
    {
      id: 'p5',
      eventId: 'sound-study',
      locationId: 'demo-stage',
      dayId: 'demo-b',
      start: '15:00',
      end: '16:00',
      status: 'prototype',
    },
  ],
  locations: [
    ...(campusLocations as Location[]),
    {
      id: 'demo-stage',
      name: '演出區・虛構示範',
      description: '測試舞台地點選取與節目連結。不是已確認的舞台或實際建物。',
      poiType: 'stage',
      status: 'prototype',
      geographic: null,
      geographicStatus: 'unlocated',
      entranceIds: [],
      navigationNodeIds: [],
      accessibility: 'unknown',
      source: '純原型資料',
    },
    {
      id: 'demo-market',
      name: '市集區・虛構示範',
      description: '測試市集區域與活動資料的關係，攤位、動線與實際位置皆待確認。',
      poiType: 'market',
      status: 'prototype',
      geographic: null,
      geographicStatus: 'unlocated',
      entranceIds: [],
      navigationNodeIds: [],
      accessibility: 'unknown',
      source: '純原型資料',
    },
    {
      id: 'demo-entrance',
      name: '入口・虛構示範',
      description: '未驗證的入口示意。不能據此判斷開放時間、通行條件或無障礙可達性。',
      poiType: 'entrance',
      status: 'prototype',
      geographic: null,
      geographicStatus: 'unlocated',
      entranceIds: [],
      navigationNodeIds: [],
      accessibility: 'unknown',
      source: '純原型資料',
    },
  ],
  announcements: [
    ...officialTopics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      summary: topic.summary,
      body: topic.body,
      publishedAt: null,
      source: socialSource,
      context: '第二屆 · 官方社群公告',
      status: 'pending' as const,
      editionId: 'second-edition',
    })),
    {
      id: 'next-spring',
      title: story.announcement.title,
      summary: story.announcement.summary,
      body: story.announcement.detail,
      publishedAt: '2026-09-30',
      source: story.announcement.source,
      context: story.announcement.label,
      status: 'prototype',
      editionId: 'upcoming-tbd',
    },
  ],
  organizers: [
    {
      id: 'planning',
      role: '企劃與統籌',
      name: null,
      description: '讓不同的想法聚成一次相遇。職能分類為原型示範，實際分工待確認。',
      status: 'prototype',
    },
    {
      id: 'creative',
      role: '視覺與創作',
      name: null,
      description: '讓祭典有自己的表達。職能分類為原型示範，實際分工待確認。',
      status: 'prototype',
    },
    {
      id: 'field',
      role: '場務與參與',
      name: null,
      description: '讓參與更清楚、更順暢。職能分類為原型示範，實際分工待確認。',
      status: 'prototype',
    },
  ],
  sponsors: [
    {
      id: 'partners-pending',
      name: null,
      status: 'pending',
      note: '贊助與合作名單、標誌和使用授權待確認。',
    },
  ],
};
export const getEvent = (id: string) => snapshot.events.find((e) => e.id === id);
export const getLocation = (id: string) => snapshot.locations.find((l) => l.id === id);
export const mapHref = (id: string) => `/map?location=${encodeURIComponent(id)}`;
export { story };
