import type { ObjectId } from 'mongoose';
import { Schema } from 'mongoose';
import { PersonaModelName, type PersonaType } from './Persona.model';
import {
  AdditionaInfoEntrySchema,
  FileSchema,
  ImageSchema,
  type AdditionaInfoEntryType,
  type CommonSchemaType,
  type FileType,
  type ImageType,
} from './commonSchemas';
import { modelGetter, withTimestampsAndId } from './util';

export type VehicleType = CommonSchemaType<{
  additionalInfoEntry: AdditionaInfoEntryType[];
  color: string;
  files: FileType[];
  images: ImageType[];
  make: string;
  model: string;
  pictureId: ImageType['id'];
  plate: string;
}>;

export const VehicleSchema = new Schema<VehicleType>(
  {
    additionalInfoEntry: {
      default: [],
      required: true,
      type: [AdditionaInfoEntrySchema],
    },
    color: {
      required: true,
      type: String,
    },
    files: {
      default: [],
      required: true,
      type: [FileSchema],
    },
    images: {
      default: [],
      required: true,
      type: [ImageSchema],
    },
    make: {
      required: true,
      type: String,
    },
    model: {
      required: true,
      type: String,
    },
    pictureId: {
      required: true,
      type: Schema.Types.ObjectId,
      validate: {
        message: 'Image does not exist',
        validator(this: VehicleType, value: ObjectId) {
          if (!this.images.some((image) => image.id === value)) {
            return false;
          }

          return true;
        },
      },
    },
    plate: {
      required: true,
      type: String,
    },
  },
  withTimestampsAndId({}),
);

export type PetTyoe = CommonSchemaType<{
  additionalInfoEntry: AdditionaInfoEntryType[];
  breed: string;
  files: FileType[];
  images: ImageType[];
  name: string;
  pictureId: ImageType['id'];
  type: string;
  weightInKilograms?: number;
  yearOfBirth?: string;
}>;

export const PetSchema = new Schema<PetTyoe>(
  {
    additionalInfoEntry: {
      default: [],
      required: true,
      type: [AdditionaInfoEntrySchema],
    },
    breed: {
      required: true,
      type: String,
    },
    files: {
      default: [],
      required: true,
      type: [FileSchema],
    },
    images: {
      default: [],
      required: true,
      type: [ImageSchema],
    },
    name: {
      required: true,
      type: String,
    },
    pictureId: {
      required: true,
      type: Schema.Types.ObjectId,
      validate: {
        message: 'Image does not exist',
        validator(this: PetTyoe, value: ObjectId) {
          if (!this.images.some((image) => image.id === value)) {
            return false;
          }

          return true;
        },
      },
    },
    type: {
      required: true,
      type: String,
    },
    weightInKilograms: {
      type: Number,
    },
    yearOfBirth: {
      type: String,
    },
  },
  withTimestampsAndId({}),
);

export enum HouseSharableInfoEnum {
  OWNER = 'OWNER',
  PETS = 'PETS',
  PRIMARY_EMAIL_ADDRESS = 'PRIMARY_EMAIL_ADDRESS',
  PRIMARY_PHONE_NUMBER = 'PRIMARY_PHONE_NUMBER',
  TENANT = 'TENANT',
  VEHICLES = 'VEHICLES',
}

export type HouseType = CommonSchemaType<{
  additionalInfoEntry: AdditionaInfoEntryType[];
  allowedToAdminHouseId: PersonaType['id'][];
  callToApproveOrderId: PersonaType['id'][];
  disallowedToApproveId: PersonaType['id'][];
  disallowedToBookId: PersonaType['id'][];
  files: FileType[];
  images: ImageType[];
  isOccupied: boolean;
  number: number;
  ownerId: PersonaType['id'];
  peopleId: PersonaType['id'][];
  permanentNotes: string[];
  pets: PetTyoe[];
  sharedInfo: HouseSharableInfoEnum[];
  street: string;
  tenantId?: PersonaType['id'];
  vehicles: VehicleType[];
}>;

export const HouseSchema = new Schema<HouseType>(
  {
    additionalInfoEntry: {
      default: [],
      required: true,
      type: [AdditionaInfoEntrySchema],
    },
    allowedToAdminHouseId: {
      default: [],
      ref: PersonaModelName,
      required: true,
      type: [Schema.Types.ObjectId],
    },
    callToApproveOrderId: {
      default: [],
      ref: PersonaModelName,
      required: true,
      type: [Schema.Types.ObjectId],
    },
    disallowedToApproveId: {
      default: [],
      ref: PersonaModelName,
      required: true,
      type: [Schema.Types.ObjectId],
    },
    disallowedToBookId: {
      default: [],
      ref: PersonaModelName,
      required: true,
      type: [Schema.Types.ObjectId],
    },
    files: {
      default: [],
      required: true,
      type: [FileSchema],
    },
    images: {
      default: [],
      required: true,
      type: [ImageSchema],
    },
    isOccupied: {
      required: true,
      type: Boolean,
    },
    number: {
      required: true,
      type: Number,
    },
    ownerId: {
      ref: PersonaModelName,
      required: true,
      type: Schema.Types.ObjectId,
    },
    peopleId: {
      default: [],
      ref: PersonaModelName,
      required: true,
      type: [Schema.Types.ObjectId],
    },
    permanentNotes: {
      default: [],
      required: true,
      type: [String],
    },
    pets: {
      default: [],
      required: true,
      type: [PetSchema],
    },
    sharedInfo: {
      default: [],
      enum: Object.values(HouseSharableInfoEnum),
      required: true,
      type: [String],
    },
    street: {
      required: true,
      type: String,
    },
    tenantId: {
      ref: PersonaModelName,
      type: Schema.Types.ObjectId,
    },
    vehicles: {
      default: [],
      required: true,
      type: [VehicleSchema],
    },
  },
  withTimestampsAndId({}),
);

export const HouseModelName = 'House';
export const getHouseModel = modelGetter(HouseModelName, HouseSchema);
