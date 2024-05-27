import { Schema, Types } from 'mongoose';
import { modelGetter, withTimestampsAndId } from './util';
import type { CommonSchemaType } from './commonSchemas';
import { PersonaModelName, type PersonaType } from './Persona.model';
import { HouseModelName, type HouseType } from './House.model';
import { SpaceModelName, type SpaceType } from './Space.model';

export type BookingType = CommonSchemaType<{
  approvedAtDatetime?: Date;
  approvedById?: PersonaType['id'];
  approverNotes?: string;
  bookingEnd: Date;
  bookingStart: Date;
  extraPeopleId: PersonaType['id'][];
  houseId: HouseType['id'];
  isApproved: boolean;
  notes?: string;
  organizerId: PersonaType['id'];
  spaceId: SpaceType['id'];
}>;

export const BookingSchema = new Schema<BookingType>(
  {
    approvedAtDatetime: {
      type: Date,
    },
    approvedById: {
      ref: PersonaModelName,
      type: Types.ObjectId,
    },
    approverNotes: {
      type: String,
    },
    bookingEnd: {
      required: true,
      type: Date,
    },
    bookingStart: {
      required: true,
      type: Date,
    },
    extraPeopleId: {
      default: [],
      ref: PersonaModelName,
      type: [Types.ObjectId],
    },
    houseId: {
      ref: HouseModelName,
      required: true,
      type: Types.ObjectId,
    },
    isApproved: {
      default: false,
      required: true,
      type: Boolean,
    },
    notes: {
      type: String,
    },
    organizerId: {
      ref: PersonaModelName,
      required: true,
      type: Types.ObjectId,
    },
    spaceId: {
      ref: SpaceModelName,
      required: true,
      type: Types.ObjectId,
    },
  },
  withTimestampsAndId({}),
);

export const BookingModelName = 'Booking';
export const getBookingModel = modelGetter(BookingModelName, BookingSchema);
