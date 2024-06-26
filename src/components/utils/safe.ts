export function getEnvSafe(overrideValue?: boolean) {
  if (typeof overrideValue !== 'undefined') {
    return overrideValue;
  }

  if (process.env.NODE_ENV === 'development') {
    return false;
  }

  return true;
}
