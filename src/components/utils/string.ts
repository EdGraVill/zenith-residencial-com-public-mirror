export function capitalizeString(str: string) {
  const [first, ...rest] = str.split('');

  return `${first.toUpperCase()}${rest.join('')}`;
}
