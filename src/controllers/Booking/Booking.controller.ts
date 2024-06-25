import type { BookingType } from '@/db/Booking.model';
import { getBookingModel } from '@/db/Booking.model';
import Space from '../Space/Space.controller';
import { SpaceNotFound } from '../Space/errors';
import {
  BookingAlreadyApproved,
  BookingAlreadyDeclined,
  BookingNotFound,
  BookingNotRequired,
  InvalidBookingDuration,
  InvalidBookingTime,
  SpaceClosed,
  TooManyPeople,
} from './errors';
import { format } from 'date-fns/format';
import type { CommonDocumentType, DayOfWeekType } from '@/db/commonSchemas';
import { differenceInMinutes } from 'date-fns/differenceInMinutes';
import { isValidStartTime } from '@/timeUtils';
import type { PersonaType } from '@/db/Persona.model';
import { CommonController } from '../CommonControllers';
import assert from '@/utils/assert';

export type BookingDocumentType = CommonDocumentType<BookingType>;

export default class Booking extends CommonController<BookingType> {
  private static readonly model = getBookingModel();

  public static async getById(id: BookingType['id']) {
    const booking = await this.dbManipulation(() => this.model.findById<BookingDocumentType>(id));

    assert(booking, () => new BookingNotFound(id));

    return new Booking(booking);
  }

  public static async create(
    booking: Pick<
      BookingType,
      'bookingEnd' | 'bookingStart' | 'extraPeopleId' | 'houseId' | 'notes' | 'organizerId' | 'spaceId'
    >,
  ) {
    const space = await Space.getById(booking.spaceId);

    assert(space, () => new SpaceNotFound(booking.spaceId));
    assert(space.getValue('requiresBooking'), () => new BookingNotRequired(booking.spaceId));

    const dateOfBookingInYYYYMMDD = format(booking.bookingStart, 'yyyy-MM-dd');

    assert(
      !space.getValue('availability').closedInYYYYMMDD.includes(dateOfBookingInYYYYMMDD),
      () => new SpaceClosed(booking.spaceId, booking.bookingStart),
    );

    const spaceAvailability = space.getValue('availability');
    const bookingDayOfWeek = format(booking.bookingStart, 'EEEE').toLowerCase() as DayOfWeekType;
    const currentAvailabilityDay = spaceAvailability[bookingDayOfWeek];

    assert(currentAvailabilityDay.length, () => new SpaceClosed(booking.spaceId, booking.bookingStart));

    const bookingDurationInMinutes = differenceInMinutes(booking.bookingEnd, booking.bookingStart);

    assert(
      bookingDurationInMinutes > 0,
      () => new InvalidBookingDuration(booking.spaceId, booking.bookingStart, booking.bookingEnd),
    );

    assert(
      space.getValue('slotsInMinutes').includes(bookingDurationInMinutes),
      () => new InvalidBookingDuration(booking.spaceId, booking.bookingStart, booking.bookingEnd),
    );

    const availabilities = currentAvailabilityDay.map(({ from, to, timezone }) => ({
      end: new Date(`${dateOfBookingInYYYYMMDD}T${to}:00.000${timezone}`),
      start: new Date(`${dateOfBookingInYYYYMMDD}T${from}:00.000${timezone}`),
    }));

    assert(
      availabilities.some(({ start, end }) => booking.bookingStart >= start && booking.bookingEnd <= end),
      () => new InvalidBookingTime(booking.spaceId, booking.bookingStart, booking.bookingEnd),
    );

    assert(
      isValidStartTime(availabilities, Math.min(...space.getValue('slotsInMinutes')), booking.bookingStart),
      () => new InvalidBookingTime(booking.spaceId, booking.bookingStart, booking.bookingEnd),
    );

    const booksInsideSlot: CommonDocumentType<BookingType>[] = await this.dbManipulation(() =>
      this.model.find({
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
      }),
    );

    const totalPeople = booking.extraPeopleId.length + 1;
    const alreadyBookedPeople = booksInsideSlot.reduce((acc, book) => acc + book.get('extraPeople').length + 1, 0);

    assert(
      totalPeople + alreadyBookedPeople <= space.getValue('maximumPeoplePerSlot'),
      () =>
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
      bookingToCreate.approvedById = booking.organizerId;
      bookingToCreate.approverNotes = 'No approval needed. Booking was auto-approved.';
    }

    const newBooking = await this.dbManipulation(() => this.model.create(bookingToCreate));

    return new Booking(newBooking as unknown as BookingDocumentType);
  }

  public approve(approverId: PersonaType['id'], notes: string) {
    // TODO: Implement validate approverId and permissions

    assert(!this.getValue('isApproved'), () => new BookingAlreadyApproved(this.id, this.getValue('approvedById')));
    assert(!this.getValue('isDeclined'), () => new BookingAlreadyDeclined(this.id, this.getValue('declinedById')));

    return this.update({
      approvedAtDatetime: new Date(),
      approvedById: approverId,
      approverNotes: notes,
      isApproved: true,
    });
  }

  public decline(declinerId: PersonaType['id'], notes: string) {
    // TODO: Implement validate approverId and permissions (Can self decline)

    assert(!this.getValue('isDeclined'), () => new BookingAlreadyDeclined(this.id, this.getValue('declinedById')));

    return this.update({
      declinedAtDatetime: new Date(),
      declinedById: declinerId,
      declinerNotes: notes,
      isDeclined: true,
    });
  }

  public cancel = this.decline;
}
