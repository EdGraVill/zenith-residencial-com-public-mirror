'use client';

import { differenceInSeconds, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

interface Props {
  addSuffix?: boolean;
  date: Date | string;
}

const RelativeTimeToNow: FC<Props> = ({ addSuffix, date }) => {
  const [intervalInMs, setIntervalInMs] = useState(1000);
  const [formattedDate, setFormattedDate] = useState(
    formatDistanceToNow(new Date(date), { addSuffix, includeSeconds: true, locale: es }),
  );

  useEffect(() => {
    const diff = Math.abs(differenceInSeconds(new Date(date), new Date()));

    if (diff < 60) {
      setIntervalInMs(1000);
    } else if (diff < 60 * 60) {
      setIntervalInMs(30 * 1000);
    } else if (diff < 60 * 60 * 24) {
      setIntervalInMs(60 * 60 * 1000);
    } else {
      setIntervalInMs(24 * 60 * 60 * 1000);
    }
  }, [formattedDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedDate(formatDistanceToNow(new Date(date), { addSuffix, includeSeconds: true, locale: es }));
    }, intervalInMs);

    return () => {
      clearInterval(interval);
    };
  }, [date, intervalInMs]);

  return formattedDate;
};

export default RelativeTimeToNow;
