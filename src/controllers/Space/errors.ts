import CommonError from '@/CommonError';
import type { UUIDType } from '@/commonTypes';
import type { SpaceType } from '@/db/Space.model';

export class SpaceNotFound extends CommonError {
  constructor(spaceId: SpaceType['id']) {
    super('Space not found');

    this.name = 'SpaceNotFound';

    this.log(`Space with id ${spaceId} not found`, this);
  }
}

export class SpaceImageNotFound extends CommonError {
  constructor(spaceId: SpaceType['id'], imageUUID: UUIDType) {
    super('Space image not found');

    this.name = 'SpaceImageNotFound';

    this.log(`Space with id ${spaceId} does not have an image with UUID ${imageUUID}`, this);
  }
}
