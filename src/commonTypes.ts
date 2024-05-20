import type { randomUUID } from 'crypto';
import type { TimeType } from './timeUtils';

export type UUIDType = ReturnType<typeof randomUUID>;

export enum PeriodicityEnum {
  DAILY = 'DAILY',
  HOURLY = 'HOURLY',
  MONTHLY = 'MONTHLY',
  ONCE = 'ONCE',
  PER_MINUTE = 'PER_MINUTE',
  WEEKLY = 'WEEKLY',
  YEARLY = 'YEARLY',
}

export enum CurrencyEnum {
  EUR = 'EUR',
  MXN = 'MXN',
  USD = 'USD',
}

export interface PriceType {
  amountInCents: number;
  currency: string;
  periodicity: PeriodicityEnum;
}

export interface ThumbnailType {
  color: string;
  height: number;
  sizeInBytes: number;
  url: string;
  width: number;
}

export interface ImageType {
  description: string;
  height: number;
  mimeType: string;
  name: string;
  sizeInBytes: number;
  thumbnail: ThumbnailType;
  url1x: string;
  url2x: string;
  url3x: string;
  uuid: UUIDType;
  width: number;
}

export interface TimeAvailabilityType {
  from: TimeType;
  timezone?: string;
  to: TimeType;
}

export type DayOfWeekType = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type AvailabilityType = {
  closedInYYYYMMDD: string[];
  defaultTimezone: string;
} & Record<DayOfWeekType, TimeAvailabilityType[]>;
