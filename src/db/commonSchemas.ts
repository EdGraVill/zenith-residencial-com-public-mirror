import type { UUIDType } from '@/commonTypes';
import { isValideTime, type TimeType } from '@/timeUtils';
import { randomUUID } from 'crypto';
import type { Document, ObjectId } from 'mongoose';
import { Schema } from 'mongoose';
import { withTimestampsAndId } from './util';

export type CommonIdType = ObjectId;
export const CommonId = Schema.Types.ObjectId;

export type CommonSchemaType<S> = {
  id: CommonIdType;
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
  };
} & S;

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

export type PriceType = CommonSchemaType<{
  amountInCents: number;
  currency: CurrencyEnum;
  periodicity: PeriodicityEnum;
}>;

export const PriceSchema = new Schema<PriceType>(
  {
    amountInCents: {
      required: true,
      type: Number,
    },
    currency: {
      enum: Object.keys(CurrencyEnum),
      required: true,
      type: String,
    },
    periodicity: {
      enum: Object.keys(PeriodicityEnum),
      required: true,
      type: String,
    },
  },
  withTimestampsAndId({}),
);

export type ThumbnailType = CommonSchemaType<{
  color: string;
  height: number;
  sizeInBytes: number;
  url: string;
  width: number;
}>;

export const ThumbnailSchema = new Schema<ThumbnailType>(
  {
    color: {
      required: true,
      type: String,
    },
    height: {
      required: true,
      type: Number,
    },
    sizeInBytes: {
      required: true,
      type: Number,
    },
    url: {
      required: true,
      type: String,
    },
    width: {
      required: true,
      type: Number,
    },
  },
  withTimestampsAndId({}),
);

export type FileType = CommonSchemaType<{
  description: string;
  isInTrash: boolean;
  mimeType: string;
  name: string;
  sizeInBytes: number;
  thumbnail: ThumbnailType;
  uuid: UUIDType;
}>;

export const FileSchema = new Schema<FileType>(
  {
    description: {
      required: true,
      type: String,
    },
    isInTrash: {
      default: false,
      required: true,
      type: Boolean,
    },
    mimeType: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    sizeInBytes: {
      required: true,
      type: Number,
    },
    thumbnail: {
      required: true,
      type: ThumbnailSchema,
    },
    uuid: {
      default: () => randomUUID(),
      required: true,
      type: String,
    },
  },
  withTimestampsAndId({}),
);

export type ImageType = CommonSchemaType<{
  description: string;
  height: number;
  isInTrash: boolean;
  mimeType: string;
  name: string;
  sizeInBytes: number;
  thumbnail: ThumbnailType;
  url1x: string;
  url2x: string;
  url3x: string;
  uuid: UUIDType;
  width: number;
}>;

export const ImageSchema = new Schema<ImageType>(
  {
    description: {
      required: true,
      type: String,
    },
    height: {
      required: true,
      type: Number,
    },
    isInTrash: {
      default: false,
      required: true,
      type: Boolean,
    },
    mimeType: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    sizeInBytes: {
      required: true,
      type: Number,
    },
    thumbnail: {
      required: true,
      type: ThumbnailSchema,
    },
    url1x: {
      required: true,
      type: String,
    },
    url2x: {
      required: true,
      type: String,
    },
    url3x: {
      required: true,
      type: String,
    },
    uuid: {
      default: () => randomUUID(),
      required: true,
      type: String,
    },
    width: {
      required: true,
      type: Number,
    },
  },
  withTimestampsAndId({}),
);

export type TimeAvailabilityType = CommonSchemaType<{
  from: TimeType;
  timezone?: string;
  to: TimeType;
}>;

export const TimeAvailabilitySchema = new Schema<TimeAvailabilityType>(
  {
    from: {
      required: true,
      type: String,
      validate: {
        message: 'Invalid time',
        validator(value: TimeType) {
          return isValideTime(value);
        },
      },
    },
    timezone: {
      required: false,
      type: String,
    },
    to: {
      required: true,
      type: String,
      validate: {
        message: 'Invalid time',
        validator(value: TimeType) {
          return isValideTime(value);
        },
      },
    },
  },
  withTimestampsAndId({}),
);

export type DayOfWeekType = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type AvailabilityType = CommonSchemaType<
  {
    closedInYYYYMMDD: string[];
    defaultTimezone: string;
  } & Record<DayOfWeekType, TimeAvailabilityType[]>
>;

export const AvailabilitySchema = new Schema<AvailabilityType>(
  {
    closedInYYYYMMDD: {
      default: [],
      required: true,
      type: [String],
    },
    defaultTimezone: {
      required: true,
      type: String,
    },
    friday: {
      required: true,
      type: [TimeAvailabilitySchema],
    },
    monday: {
      required: true,
      type: [TimeAvailabilitySchema],
    },
    saturday: {
      required: true,
      type: [TimeAvailabilitySchema],
    },
    sunday: {
      required: true,
      type: [TimeAvailabilitySchema],
    },
    thursday: {
      required: true,
      type: [TimeAvailabilitySchema],
    },
    tuesday: {
      required: true,
      type: [TimeAvailabilitySchema],
    },
    wednesday: {
      required: true,
      type: [TimeAvailabilitySchema],
    },
  },
  withTimestampsAndId({}),
);

export enum FieldTypeEnum {
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  FILE = 'FILE',
  IMAGE = 'IMAGE',
  NUMBER = 'NUMBER',
  TEXT = 'TEXT',
  TIME = 'TIME',
}

export type AdditionaInfoEntryType = CommonSchemaType<{
  isInTrash: boolean;
  name: string;
  type: FieldTypeEnum;
  value: string;
}>;

export const AdditionaInfoEntrySchema = new Schema({
  isInTrash: {
    default: false,
    required: true,
    type: Boolean,
  },
  name: {
    required: true,
    type: String,
  },
  type: {
    enum: Object.keys(FieldTypeEnum),
    required: true,
    type: String,
  },
  value: {
    required: true,
    type: String,
  },
});

export type CommonDocumentType<S> = Document<CommonIdType, Record<never, never>, S> & S;
