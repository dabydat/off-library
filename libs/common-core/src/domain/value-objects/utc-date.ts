import { formatInTimeZone } from 'date-fns-tz';
import { UtcDateException } from '../exceptions';
import ValueObject from './value-object';

export interface UtcDateProps {
  value: Date;
}

export class UtcDate extends ValueObject<UtcDateProps> {
  private constructor(private readonly value: Date) {
    super({ value });
  }

  public static create(value: Date | string): UtcDate {
    const newValue: Date = UtcDate.validate(value);

    return new UtcDate(newValue);
  }

  public static now(): UtcDate {
    const currentDate = new Date();
    return new UtcDate(currentDate);
  }

  private static validate(value: Date | string): Date {
    if (typeof value === 'string') {
      const parsedDate = new Date(value);
      if (isNaN(parsedDate.getTime())) {
        throw new UtcDateException('Invalid date string format.', value);
      }
      return new UtcDate(parsedDate).toUtc(parsedDate);
    }

    if (!(value instanceof Date)) {
      throw new UtcDateException(
        'Date must be a valid Date object or ISO string.',
        value as string,
      );
    }

    return new UtcDate(value).toUtc(value);
  }

  private toUtc(date: Date): Date {
    const utcDate = new Date(date.toISOString());
    if (utcDate.toISOString() !== date.toISOString()) {
      throw new UtcDateException('Date is not in UTC format.', date.toString());
    }
    return utcDate;
  }

  public get getValue(): Date {
    return this.value;
  }

  public get toISOString(): string {
    return this.value.toISOString();
  }

  public isBefore(date: UtcDate): boolean {
    return this.value.getTime() < date.getValue.getTime();
  }

  public isAfter(date: UtcDate): boolean {
    return this.value.getTime() > date.getValue.getTime();
  }

  public addSeconds(seconds: number): UtcDate {
    const newDate = new Date(this.value.getTime() + seconds * 1000);
    return UtcDate.create(newDate);
  }

  public addMinutes(minutes: number): UtcDate {
    return this.addSeconds(minutes * 60);
  }

  public addHours(hours: number): UtcDate {
    return this.addMinutes(hours * 60);
  }

  public addDays(days: number): UtcDate {
    return this.addHours(days * 24);
  }

  public equals(date: UtcDate): boolean {
    return this.value.getTime() === date.getValue.getTime();
  }

  public get toUtcString(): string {
    return formatInTimeZone(this.value, 'UTC', 'yyyy-MM-dd HH:mm:ss.SSSSSS');
  }
}
