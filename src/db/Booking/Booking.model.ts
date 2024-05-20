import assert from 'assert';
import Space from '../Space';
import { getBookingModel, type BookingType } from './model';
import { format } from 'date-fns/format';
import { differenceInMinutes } from 'date-fns/differenceInMinutes';
import type { DayOfWeekType } from '@/commonTypes';
import { isValidStartTime } from '@/timeUtils';
import type { Document, ObjectId } from 'mongoose';
import { SpaceNotFound } from '../Space/errors';
import {
  BookingDbError,
  BookingNotRequired,
  InvalidBookingDuration,
  InvalidBookingTime,
  SpaceClosed,
  TooManyPeople,
} from './errors';

export default class Booking {
  public static async book(
    booking: Pick<
      BookingType,
      'bookingEnd' | 'bookingStart' | 'extraPeople' | 'houseId' | 'notes' | 'organizer' | 'spaceId'
    >,
  ) {
    const space = await Space.findById(booking.spaceId);

    assert(space, new SpaceNotFound(booking.spaceId));
    assert(space.getValue('requiresBooking'), new BookingNotRequired(booking.spaceId));

    const dateOfBookingInYYYYMMDD = format(booking.bookingStart, 'yyyy-MM-dd');

    assert(
      !space.getValue('availability').closedInYYYYMMDD.includes(dateOfBookingInYYYYMMDD),
      new SpaceClosed(booking.spaceId, booking.bookingStart),
    );

    const spaceAvailability = space.getValue('availability');
    const bookingDayOfWeek = format(booking.bookingStart, 'EEEE').toLowerCase() as DayOfWeekType;
    const currentAvailabilityDay = spaceAvailability[bookingDayOfWeek];

    assert(currentAvailabilityDay.length, new SpaceClosed(booking.spaceId, booking.bookingStart));

    const bookingDurationInMinutes = differenceInMinutes(booking.bookingEnd, booking.bookingStart);

    assert(
      bookingDurationInMinutes > 0,
      new InvalidBookingDuration(booking.spaceId, booking.bookingStart, booking.bookingEnd),
    );

    assert(
      space.getValue('slotsInMinutes').includes(bookingDurationInMinutes),
      new InvalidBookingDuration(booking.spaceId, booking.bookingStart, booking.bookingEnd),
    );

    const availabilities = currentAvailabilityDay.map(({ from, to, timezone }) => ({
      end: new Date(`${dateOfBookingInYYYYMMDD}T${to}:00.000${timezone}`),
      start: new Date(`${dateOfBookingInYYYYMMDD}T${from}:00.000${timezone}`),
    }));

    assert(
      availabilities.some(({ start, end }) => booking.bookingStart >= start && booking.bookingEnd <= end),
      new InvalidBookingTime(booking.spaceId, booking.bookingStart, booking.bookingEnd),
    );

    assert(
      isValidStartTime(availabilities, Math.min(...space.getValue('slotsInMinutes')), booking.bookingStart),
      new InvalidBookingTime(booking.spaceId, booking.bookingStart, booking.bookingEnd),
    );

    const bookingModel = getBookingModel();

    let booksInsideSlot: Document<ObjectId, Record<never, never>, BookingType>[] = [];

    try {
      booksInsideSlot = await bookingModel.find({
        $and: [
          { spaceId: booking.spaceId },
          { isApproved: true },
          {
            $or: [
              { bookingStart: { $gte: booking.bookingStart, $lt: booking.bookingEnd } },
              { bookingEnd: { $gt: booking.bookingStart, $lte: booking.bookingEnd } },
            ],
          },
        ],
      });
    } catch (error) {
      throw new BookingDbError(error as Error);
    }

    const totalPeople = booking.extraPeople.length + 1;
    const alreadyBookedPeople = booksInsideSlot.reduce((acc, book) => acc + book.get('extraPeople').length + 1, 0);

    assert(
      totalPeople + alreadyBookedPeople <= space.getValue('maximumPeoplePerSlot'),
      new TooManyPeople(booking.spaceId, totalPeople, alreadyBookedPeople, space.getValue('maximumPeoplePerSlot')),
    );

    const requiresApproval = space.getValue('requiresApproval');

    const bookingToCreate = {
      ...booking,
    } as BookingType;

    if (requiresApproval) {
      bookingToCreate.isApproved = false;
    } else {
      bookingToCreate.isApproved = true;
      bookingToCreate.approvedAtDatetime = new Date();
      bookingToCreate.approvedBy = booking.organizer;
      bookingToCreate.approverNotes = 'No approval needed. Booking was auto-approved.';
    }

    try {
      const result = await bookingModel.create(bookingToCreate);

      return result;
    } catch (error) {
      throw new BookingDbError(error as Error);
    }
  }
}
