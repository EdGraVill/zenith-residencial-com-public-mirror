import { Schema } from 'mongoose';
import { modelGetter, withTimestampsAndId } from './util';
import { CommonId, type CommonSchemaType } from './commonSchemas';
import { PersonaModelName, type PersonaType } from './Persona.model';
import { HouseModelName, type HouseType } from './House.model';
import { SpaceModelName, type SpaceType } from './Space.model';

export type BookingType = CommonSchemaType<{
  approvedAtDatetime?: Date;
  approvedById?: PersonaType['id'];
  approverNotes?: string;
  bookingEnd: Date;
  bookingStart: Date;
  declinedAtDatetime?: Date;
  declinedById?: PersonaType['id'];
  declinerNotes?: string;
  extraPeopleId: PersonaType['id'][];
  houseId: HouseType['id'];
  isApproved: boolean;
  isDeclined?: boolean;
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
      type: CommonId,
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
    declinedAtDatetime: {
      type: Date,
    },
    declinedById: {
      ref: PersonaModelName,
      type: CommonId,
    },
    declinerNotes: {
      type: String,
    },
    extraPeopleId: {
      default: [],
      ref: PersonaModelName,
      type: [CommonId],
    },
    houseId: {
      ref: HouseModelName,
      required: true,
      type: CommonId,
    },
    isApproved: {
      default: false,
      required: true,
      type: Boolean,
    },
    isDeclined: {
      type: Boolean,
    },
    notes: {
      type: String,
    },
    organizerId: {
      ref: PersonaModelName,
      required: true,
      type: CommonId,
    },
    spaceId: {
      ref: SpaceModelName,
      required: true,
      type: CommonId,
    },
  },
  withTimestampsAndId({}),
);

export const BookingModelName = 'Booking';
export const getBookingModel = modelGetter(BookingModelName, BookingSchema);
