import { randomUUID } from 'crypto';
import type { UUIDType } from './commonTypes';

const isDebug = true;

const newDebugPrefix = (errorId: UUIDType) => (isDebug ? `[Error id ${errorId}]: ` : '');

export default class CommonError extends Error {
  protected readonly id = randomUUID();
  protected prefix = newDebugPrefix(this.id);

  constructor(message: string) {
    super(message);

    this.message = `${this.prefix}${message}`;
  }

  protected log(...messages: unknown[]) {
    // TODO: Add robust logging system

    console.error(
      this.message,
      '\n',
      ...messages.map((message, ix) => [
        `-- [Error id ${this.id}] Message ${ix + 1}/${messages.length} --\n`,
        message,
        '\n',
      ]),
    );
  }
}
