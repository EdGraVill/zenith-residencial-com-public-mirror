import CommonError from '@/CommonError';
import type { BookingType } from '@/db/Booking.model';
import type { SpaceType } from '@/db/Space.model';
import { format } from 'date-fns/format';

export class BookingNotFound extends CommonError {
  constructor(bookingId: BookingType['id']) {
    super('Booking not found');

    this.name = 'BookingNotFound';

    this.log(`Booking with id ${bookingId} not found`, this);
  }
}

export class BookingNotRequired extends CommonError {
  constructor(spaceId: SpaceType['id']) {
    super('Booking not required');

    this.name = 'BookingNotRequired';

    this.log(`Space with id ${spaceId} does not require booking`, this);
  }
}

export class SpaceClosed extends CommonError {
  constructor(spaceId: SpaceType['id'], date: Date) {
    super('Space is closed');

    this.name = 'SpaceClosed';

    this.log(`Space with id ${spaceId} is closed for ${format(date, 'Pp')}`, this);
  }
}

export class InvalidBookingDuration extends CommonError {
  constructor(spaceId: SpaceType['id'], bookingStart: Date, bookingEnd: Date) {
    super('Invalid booking duration');

    this.name = 'InvalidBookingDuration';

    this.log(
      `Space with id ${spaceId} does not support booking from ${format(bookingStart, 'Pp')} to ${format(bookingEnd, 'Pp')}`,
      this,
    );
  }
}

export class InvalidBookingTime extends CommonError {
  constructor(spaceId: SpaceType['id'], bookingStart: Date, bookingEnd: Date) {
    super('Invalid booking time');

    this.name = 'InvalidBookingTime';

    this.log(
      `Space with id ${spaceId} does not support booking from ${format(bookingStart, 'Pp')} to ${format(bookingEnd, 'Pp')}`,
      this,
    );
  }
}

export class TooManyPeople extends CommonError {
  constructor(spaceId: SpaceType['id'], thisBookingPeople: number, alreadyBookedPeople: number, maxPeople: number) {
    super('Too many people');

    this.name = 'TooManyPeople';

    this.log(
      `Space with id ${spaceId} can't accommodate ${thisBookingPeople} people. Already ${alreadyBookedPeople} people are booked. Maximum people allowed are ${maxPeople}`,
      this,
    );
  }
}

export class BookingAlreadyApproved extends CommonError {
  constructor(bookingId: BookingType['id'], approverId: BookingType['approvedById']) {
    super('Booking already approved');

    this.name = 'BookingAlreadyApproved';

    this.log(`Booking with id ${bookingId} was already approved by Persona with id ${approverId}`, this);
  }
}

export class BookingAlreadyDeclined extends CommonError {
  constructor(bookingId: BookingType['id'], declinerId: BookingType['declinedById']) {
    super('Booking already declined');

    this.name = 'BookingAlreadyDeclined';

    this.log(`Booking with id ${bookingId} was already declined by Persona with id ${declinerId}`, this);
  }
}
