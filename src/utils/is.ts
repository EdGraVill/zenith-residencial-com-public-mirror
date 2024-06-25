export function isOneOf<T>(value: T, values: T[] | readonly T[]): boolean {
  return values.includes(value);
}
