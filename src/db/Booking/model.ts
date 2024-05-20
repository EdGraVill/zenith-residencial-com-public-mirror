import { Schema, Types, type ObjectId } from 'mongoose';
import { modelGetter } from '../util';

export interface BookingType {
  approvedAtDatetime?: Date;
  approvedBy?: ObjectId;
  approverNotes?: string;
  bookingEnd: Date;
  bookingStart: Date;
  extraPeople: ObjectId[];
  houseId: ObjectId;
  id: ObjectId;
  isApproved: boolean;
  notes?: string;
  organizer: ObjectId;
  spaceId: ObjectId;
}

export const BookingSchema = new Schema<BookingType>(
  {
    approvedAtDatetime: {
      type: Date,
    },
    approvedBy: {
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
    extraPeople: {
      default: [],
      type: [Types.ObjectId],
    },
    houseId: {
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
    organizer: {
      required: true,
      type: Types.ObjectId,
    },
    spaceId: {
      required: true,
      type: Types.ObjectId,
    },
  },
  {
    id: true,
    timestamps: true,
  },
);

export const getBookingModel = modelGetter('Booking', BookingSchema);
