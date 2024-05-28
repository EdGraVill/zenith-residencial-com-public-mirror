import type { SpaceType } from '@/db/Space.model';
import { getSpaceModel } from '@/db/Space.model';
import { SpaceNotFound } from './errors';
import assert from 'assert';
import type { CommonDocumentType, CommonIdType, ImageType } from '@/db/commonSchemas';
import { CommonControllerWithFilesAndImages } from '../CommonControllers';
import type { PersonaType } from '@/db/Persona.model';

export type SpaceDocumentType = CommonDocumentType<SpaceType>;

export default class Space extends CommonControllerWithFilesAndImages<SpaceType> {
  private static readonly model = getSpaceModel();

  public static async getById(id: CommonIdType) {
    const space = await this.dbManipulation(() => this.model.findById<SpaceDocumentType>(id));

    assert(space, new SpaceNotFound(id));

    return new Space(space);
  }

  public static async create(
    creatorId: PersonaType['id'],
    space: Pick<
      SpaceType,
      | 'additionalInfoEntry'
      | 'approverGroupsId'
      | 'approverPeopleId'
      | 'availability'
      | 'capacity'
      | 'description'
      | 'isServicePerHouse'
      | 'maximumPeoplePerSlot'
      | 'maximumTimePerPersonInMinutes'
      | 'minimumPeoplePerSlot'
      | 'name'
      | 'prices'
      | 'requiresApproval'
      | 'requiresBooking'
      | 'slotsInMinutes'
    >,
  ) {
    // TODO: Implement validate creatorId and permissions

    return await this.dbManipulation(() => this.model.create(space));
  }

  public async pushImage(updaterId: PersonaType['id'], image: ImageType) {
    // TODO: Implement validate updaterId and permissions

    this.addImage(image);
  }

  public async removeImage(updaterId: PersonaType['id'], imageId: ImageType['id']) {
    // TODO: Implement validate updaterId and permissions

    this.deleteImage(imageId);
  }

  public async upsert(
    upserterId: PersonaType['id'],
    newValues: Partial<
      Pick<
        SpaceType,
        | 'additionalInfoEntry'
        | 'approverGroupsId'
        | 'approverPeopleId'
        | 'availability'
        | 'capacity'
        | 'description'
        | 'isServicePerHouse'
        | 'maximumPeoplePerSlot'
        | 'maximumTimePerPersonInMinutes'
        | 'minimumPeoplePerSlot'
        | 'name'
        | 'prices'
        | 'requiresApproval'
        | 'requiresBooking'
        | 'slotsInMinutes'
      >
    >,
  ) {
    // TODO: Implement validate upserterId and permissions

    return this.update(newValues);
  }
}
