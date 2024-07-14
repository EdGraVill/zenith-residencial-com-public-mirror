export function objectFromDotPath(object: Record<string, unknown>) {
  const newObject: Record<string, unknown> = {};

  for (const key in object) {
    const keyParts = key.split('.');
    const value = object[key];

    keyParts.reduce((acc, keyPart, ix) => {
      if (ix === keyParts.length - 1) {
        acc[keyPart] = value;

        return acc;
      }

      if (!acc[keyPart]) {
        acc[keyPart] = {};
      }

      return acc[keyPart] as Record<string, unknown>;
    }, newObject);
  }

  return newObject;
}
