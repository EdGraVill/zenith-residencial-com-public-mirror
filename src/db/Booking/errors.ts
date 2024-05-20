import CustomError from '@/CustomError';
import { format } from 'date-fns/format';
import type { ObjectId } from 'mongoose';

export class BookingNotRequired extends CustomError {
  constructor(spaceId: ObjectId) {
    super('Booking not required');

    this.name = 'BookingNotRequired';

    console.info(`${this.prefix}Space with id ${spaceId} does not require booking\n`, this);
  }
}

export class SpaceClosed extends CustomError {
  constructor(spaceId: ObjectId, date: Date) {
    super('Space is closed');

    this.name = 'SpaceClosed';

    console.info(`${this.prefix}Space with id ${spaceId} is closed for ${format(date, 'Pp')}\n`, this);
  }
}

export class InvalidBookingDuration extends CustomError {
  constructor(spaceId: ObjectId, bookingStart: Date, bookingEnd: Date) {
    super('Invalid booking duration');

    this.name = 'InvalidBookingDuration';

    console.info(
      `${this.prefix}Space with id ${spaceId} does not support booking from ${format(bookingStart, 'Pp')} to ${format(bookingEnd, 'Pp')}\n`,
      this,
    );
  }
}

export class InvalidBookingTime extends CustomError {
  constructor(spaceId: ObjectId, bookingStart: Date, bookingEnd: Date) {
    super('Invalid booking time');

    this.name = 'InvalidBookingTime';

    console.info(
      `${this.prefix}Space with id ${spaceId} does not support booking from ${format(bookingStart, 'Pp')} to ${format(bookingEnd, 'Pp')}\n`,
      this,
    );
  }
}

export class TooManyPeople extends CustomError {
  constructor(spaceId: ObjectId, thisBookingPeople: number, alreadyBookedPeople: number, maxPeople: number) {
    super('Too many people');

    this.name = 'TooManyPeople';

    console.info(
      `${this.prefix}Space with id ${spaceId} can't accommodate ${thisBookingPeople} people. Already ${alreadyBookedPeople} people are booked. Maximum people allowed are ${maxPeople}\n`,
      this,
    );
  }
}

export class BookingDbError extends CustomError {
  constructor(originalError: Error) {
    super(originalError.message);

    this.name = 'BookingDbError';
    this.stack = originalError.stack;
    this.cause = originalError;

    console.error(`${this.prefix}Booking database error: ${originalError.message}\n`, this);
  }
}
