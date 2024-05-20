import type { AvailabilityType, ImageType, PriceType } from '@/commonTypes';
import type { ObjectId } from 'mongoose';
import { Schema } from 'mongoose';
import { modelGetter } from '../util';
import { AvailabilitySchema, ImageSchema, PriceSchema } from '../commonSchemas';

export interface SpaceType {
  approverGroups: ObjectId[];
  approverPeople: ObjectId[];
  availability: AvailabilityType;
  capacity: number;
  description: string;
  id: ObjectId;
  images: ImageType[];
  isServicePerHouse: boolean;
  maximumPeoplePerSlot: number;
  maximumTimePerPersonInMinutes: number;
  minimumPeoplePerSlot: number;
  name: string;
  prices?: PriceType[];
  requiresApproval: boolean;
  requiresBooking: boolean;
  slotsInMinutes: number[];
}

export const SpaceSchema = new Schema<SpaceType>(
  {
    approverGroups: {
      default: [],
      required: true,
      type: [Schema.Types.ObjectId],
    },
    approverPeople: {
      default: [],
      required: true,
      type: [Schema.Types.ObjectId],
    },
    availability: {
      required: true,
      type: AvailabilitySchema,
    },
    capacity: {
      required: true,
      type: Number,
    },
    description: {
      required: true,
      type: String,
    },
    images: {
      default: [],
      required: true,
      type: [ImageSchema],
    },
    isServicePerHouse: {
      required: true,
      type: Boolean,
    },
    maximumPeoplePerSlot: {
      required: true,
      type: Number,
    },
    maximumTimePerPersonInMinutes: {
      required: true,
      type: Number,
    },
    minimumPeoplePerSlot: {
      required: true,
      type: Number,
    },
    name: {
      required: true,
      type: String,
    },
    prices: {
      default: [],
      required: false,
      type: [PriceSchema],
    },
    requiresApproval: {
      default: false,
      required: true,
      type: Boolean,
    },
    requiresBooking: {
      default: false,
      required: true,
      type: Boolean,
    },
    slotsInMinutes: {
      required: true,
      type: [Number],
    },
  },
  {
    id: true,
    timestamps: true,
  },
);

export const getSpaceModel = modelGetter('Space', SpaceSchema);
