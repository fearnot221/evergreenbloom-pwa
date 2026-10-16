export type Status = 'prototype' | 'pending' | 'confirmed' | 'historical';
export type Category = 'special' | 'performance' | 'market' | 'activity';
export interface Event {
  id: string;
  editionId: string;
  title: string;
  category: Category;
  summary: string;
  description: string;
  status: Status;
  locationId: string;
  featured: boolean;
}
export interface ProgramEntry {
  id: string;
  eventId: string;
  locationId: string;
  dayId: string;
  start: string;
  end: string;
  status: Status;
}
export interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
}
export interface WorldPosition {
  x: number;
  y: number;
  z: number;
  frameId: string;
}
export interface Location {
  id: string;
  name: string;
  description: string;
  poiType: 'stage' | 'market' | 'landmark' | 'entrance' | 'building';
  status: Status;
  geographic: GeoPosition | null;
  geographicStatus?: 'community-maintained' | 'unlocated';
  aliases?: string[];
  relatedFeatureId?: string;
  relatedBuildingId?: string | null;
  anchorMethod?: string;
  entranceIds: string[];
  navigationNodeIds: string[];
  accessibility: 'unknown' | 'verified';
  source: string;
}
export interface Announcement {
  id: string;
  title: string;
  summary: string;
  body: string;
  publishedAt: string | null;
  source: string;
  context: string;
  status: Status;
  editionId: string | null;
}
export interface Organizer {
  id: string;
  role: string;
  name: string | null;
  description: string;
  status: Status;
}
export interface Sponsor {
  id: string;
  name: string | null;
  status: Status;
  note: string;
}
// Domain contracts only. No rendering imports and no claim of surveyed paths.
export interface RouteResult {
  status: 'ready' | 'unavailable' | 'unverified';
  nodeIds: string[];
  edgeIds: string[];
  path: GeoPosition[];
  distanceMeters: number | null;
  graphRevision: string;
  warnings: string[];
}
export interface ContentSnapshot {
  revision: string;
  updatedAt: string;
  editionId: string;
  events: Event[];
  program: ProgramEntry[];
  locations: Location[];
  announcements: Announcement[];
  organizers: Organizer[];
  sponsors: Sponsor[];
}
