import type {Id} from '../@types/common/index.d.ts';
import type {
  CellStamp,
  Hash,
  Stamp,
  Time,
  ValueStamp,
} from '../@types/mergeable-store/index.d.ts';
import {getHash} from './hash.ts';
import {IdMap, mapNew, mapToObj} from './map.ts';
import {IdObj, objNew} from './obj.ts';
import {isArray, isFiniteNumber, isString, size} from './other.ts';
import {EMPTY_STRING, NUMBER, getTypeOf} from './strings.ts';

export type StampMap<Thing> = Stamp<IdMap<Thing>, true>;

export type TablesStampMap = StampMap<TableStampMap>;
export type TableStampMap = StampMap<RowStampMap>;
export type RowStampMap = StampMap<CellStamp<true>>;
export type ValuesStampMap = StampMap<ValueStamp<true>>;

export const stampClone = <Value>([value, time]: Stamp<
  Value,
  boolean
>): Stamp<Value> => stampNew(value, time);

const stampCloneWithHash = <Value>([value, time, hash]: Stamp<
  Value,
  true
>): Stamp<Value, true> => [value, time, hash];

export const stampNew = <Value>(
  value: Value,
  time: Time | undefined,
): Stamp<Value> => (time ? [value, time] : [value]);

export const stampNewWithHash = <Value>(
  value: Value,
  time: Time,
  hash: Hash,
): Stamp<Value, true> => [value, time, hash];

export const getStampHash = (stamp: Stamp<unknown, true>): Hash => stamp[2];

export const hashIdAndHash = (id: Id, hash: Hash) => getHash(id + ':' + hash);

export const replaceTimeHash = (oldTime: Time, newTime: Time) =>
  newTime > oldTime ? (oldTime ? getHash(oldTime) : 0) ^ getHash(newTime) : 0;

export const getLatestTime = (
  time1: Time | undefined,
  time2: Time | undefined,
): Time =>
  /*! istanbul ignore next */
  ((time1 ?? '') > (time2 ?? '') ? time1 : time2) ?? '';

export const stampUpdate = (
  stamp: Stamp<unknown, true>,
  time: Time,
  hash: Hash,
) => {
  if (time > stamp[1]) {
    stamp[1] = time;
  }
  stamp[2] = hash >>> 0;
};

export const stampNewObj = <Thing>(time = EMPTY_STRING): Stamp<IdObj<Thing>> =>
  stampNew(objNew<Thing>(), time);

export const stampNewMap = <Thing>(time = EMPTY_STRING): StampMap<Thing> => [
  mapNew<Id, Thing>(),
  time,
  0,
];

export const stampMapToObjWithHash = <From, To = From>(
  [map, time, hash]: Stamp<IdMap<From>, true>,
  mapper: (mapValue: From) => To = stampCloneWithHash as any,
): Stamp<IdObj<To>, true> => [mapToObj(map, mapper), time, hash];

export const stampMapToObjWithoutHash = <From, To = From>(
  [map, time]: Stamp<IdMap<From>, boolean>,
  mapper: (mapValue: From) => To = stampClone as any,
): Stamp<IdObj<To>> => stampNew(mapToObj(map, mapper), time);

export const stampValidate = (
  stamp: Stamp<any, true>,
  validateThing: (thing: any) => boolean,
) =>
  isArray(stamp) &&
  size(stamp) == 3 &&
  isString(stamp[1]) &&
  getTypeOf(stamp[2]) == NUMBER &&
  isFiniteNumber(stamp[2]) &&
  validateThing(stamp[0]);
