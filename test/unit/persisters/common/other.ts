import {pause} from '../../common/other.ts';
import type {
  Changes,
  Content,
  MergeableChanges,
  MergeableContent,
  MergeableStore,
  Store,
} from 'tinybase';
import type {Persister, Persists} from 'tinybase/persisters';

export type GetLocationMethod<Location = string> = [
  string,
  (location: Location) => unknown,
];

export type Persistable<Location = string> = {
  beforeEach?: () => void;
  autoLoadPause?: number;
  getLocation: () => Promise<Location>;
  getLocationMethod?: GetLocationMethod<Location>;
  getPersister: (
    store: Store | MergeableStore,
    location: Location,
  ) => Persister<Persists> | Promise<Persister<Persists>>;
  get: (location: Location) => Promise<Content | MergeableContent | void>;
  set: (
    location: Location,
    content: Content | MergeableContent,
  ) => Promise<void>;
  write: (location: Location, rawContent: any) => Promise<void>;
  del: (location: Location) => Promise<void>;
  afterEach?: (location: Location) => Promise<void>;
  getChanges?: () => Changes | MergeableChanges;
  testMissing: boolean;
  extraLoad?: 0 | 1;
};

export const nextLoop = async (alsoNudgeHlc = false): Promise<void> =>
  await pause(0, alsoNudgeHlc);
// fs.watch misses changes made in the same loop, seemingly
