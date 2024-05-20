import { randomUUID } from 'crypto';

const isDebug = true;

const newDebugPrefix = () => (isDebug ? `[Error id ${randomUUID()}]: ` : '');

export default class CustomError extends Error {
  protected prefix = newDebugPrefix();

  constructor(message: string) {
    super(message);

    this.message = `${this.prefix}${message}`;
  }
}
