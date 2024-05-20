import type { AvailabilityType, ImageType, PriceType, ThumbnailType, TimeAvailabilityType } from '@/commonTypes';
import { CurrencyEnum, PeriodicityEnum } from '@/commonTypes';
import { isValideTime, type TimeType } from '@/timeUtils';
import { randomUUID } from 'crypto';
import { Schema } from 'mongoose';

export const PriceSchema = new Schema<PriceType>({
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
});

export const ThumbnailSchema = new Schema<ThumbnailType>({
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
});

export const ImageSchema = new Schema<ImageType>({
  description: {
    required: true,
    type: String,
  },
  height: {
    required: true,
    type: Number,
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
});

export const TimeAvailabilitySchema = new Schema<TimeAvailabilityType>({
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
});

export const AvailabilitySchema = new Schema<AvailabilityType>({
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
});
