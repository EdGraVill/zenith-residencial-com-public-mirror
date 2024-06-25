import nodeAssert from 'node:assert';

export default function assert(value: unknown, error?: () => Error): asserts value {
  try {
    return nodeAssert(value);
  } catch (err) {
    if (error) {
      throw error();
    }

    throw err;
  }
}
