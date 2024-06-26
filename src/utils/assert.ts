import nodeAssert from 'node:assert';

export default function assert(value: unknown, error?: (() => Error) | string): asserts value {
  try {
    return nodeAssert(value);
  } catch (err) {
    if (error instanceof Function) {
      throw error();
    }

    if (typeof error === 'string') {
      throw new Error(error);
    }

    throw err;
  }
}
