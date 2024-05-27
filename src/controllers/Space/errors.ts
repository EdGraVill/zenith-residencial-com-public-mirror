import CustomError from '@/CustomError';
import type { ObjectId } from 'mongoose';

export class SpaceNotFound extends CustomError {
  constructor(id: ObjectId) {
    super('Space not found');

    this.name = 'SpaceNotFound';

    console.info(`${this.prefix}Space with id ${id} not found\n`, this);
  }
}

export class SpaceImageNotFound extends CustomError {
  constructor(spaceId: ObjectId, imageUUID: string) {
    super('Space image not found');

    this.name = 'SpaceImageNotFound';

    console.info(`${this.prefix}Space with id ${spaceId} does not have an image with UUID ${imageUUID}\n`, this);
  }
}

export class SpaceDbError extends CustomError {
  constructor(originalError: Error) {
    super(originalError.message);

    this.name = 'SpaceDbError';
    this.stack = originalError.stack;
    this.cause = originalError;

    console.error(`${this.prefix}Space database error: ${originalError.message}\n`, this);
  }
}
