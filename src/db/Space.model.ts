import { Schema } from 'mongoose';
import { modelGetter, withTimestampsAndId } from './util';
import type {
  AdditionaInfoEntryType,
  AvailabilityType,
  CommonSchemaType,
  FileType,
  ImageType,
  PriceType,
} from './commonSchemas';
import { AdditionaInfoEntrySchema, AvailabilitySchema, CommonId, ImageSchema, PriceSchema } from './commonSchemas';
import { GroupModelName, type GroupType } from './Group.model';
import { PersonaModelName, type PersonaType } from './Persona.model';

export type SpaceType = CommonSchemaType<{
  additionalInfoEntry: AdditionaInfoEntryType[];
  approverGroupsId: GroupType['id'][];
  approverPeopleId: PersonaType['id'][];
  availability: AvailabilityType;
  capacity: number;
  description: string;
  files: FileType[];
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
}>;

export const SpaceSchema = new Schema<SpaceType>(
  {
    additionalInfoEntry: {
      default: [],
      required: true,
      type: [AdditionaInfoEntrySchema],
    },
    approverGroupsId: {
      default: [],
      ref: GroupModelName,
      required: true,
      type: [CommonId],
    },
    approverPeopleId: {
      default: [],
      ref: PersonaModelName,
      required: true,
      type: [CommonId],
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
  withTimestampsAndId({}),
);

export const SpaceModelName = 'Space';
export const getSpaceModel = modelGetter(SpaceModelName, SpaceSchema);
