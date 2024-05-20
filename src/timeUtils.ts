import { addMinutes } from 'date-fns/addMinutes';

export const hours = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
] as const;
export const minutes = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
  '46',
  '47',
  '48',
  '49',
  '50',
  '51',
  '52',
  '53',
  '54',
  '55',
  '56',
  '57',
  '58',
  '59',
] as const;

export type TimeType = `${(typeof hours)[number]}:${(typeof minutes)[number]}`;

export function isValideTime(time: string | TimeType) {
  const simpleValidation = /^\d{2}:\d{2}$/.test(time);

  if (!simpleValidation) {
    return false;
  }

  const [hour, minute] = time.split(':') as [(typeof hours)[number], (typeof minutes)[number]];

  const isHourValid = hours.includes(hour);

  if (!isHourValid) {
    return false;
  }

  const isMinuteValid = minutes.includes(minute);

  if (!isMinuteValid) {
    return false;
  }

  return true;
}

export function isValidStartTime(
  availabilities: Array<{ end: Date; start: Date }>,
  minimumSlotInMinutes: number,
  startTime: Date,
) {
  const availableStartTimes = availabilities
    .map(({ start, end }) => {
      const availables = [start];

      let keepChecking = true;

      while (keepChecking) {
        const lastAvailable = availables[availables.length - 1];
        const nextAvailable = addMinutes(lastAvailable, minimumSlotInMinutes);

        if (nextAvailable <= end) {
          availables.push(nextAvailable);
        } else {
          keepChecking = false;
        }
      }

      return availables;
    })
    .flat(1);

  return availableStartTimes.some((available) => available.getTime() === startTime.getTime());
}
