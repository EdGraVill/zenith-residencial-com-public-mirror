import type { SpaceType } from '@/db/Space.model';
import { getSpaceModel } from '@/db/Space.model';
import { SpaceDbError, SpaceImageNotFound, SpaceNotFound } from './errors';
import type { Document, ObjectId } from 'mongoose';
import assert from 'assert';
import type { ImageType } from '@/db/commonSchemas';
import { produce } from 'immer';
import type { UUIDType } from '@/commonTypes';

export default class Space {
  public static async create(
    space: Pick<
      SpaceType,
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
      | 'slotsInMinutes'
    >,
  ) {
    try {
      const spaceModel = getSpaceModel();

      const result = await spaceModel.create(space);

      return result;
    } catch (error) {
      throw new SpaceDbError(error as Error);
    }
  }

  public static async findById(id: ObjectId) {
    try {
      const spaceModel = getSpaceModel();

      const space = await spaceModel.findById(id);

      assert(space, new SpaceNotFound(id));

      return new Space(space as unknown as Document<ObjectId, Record<never, never>, SpaceType> & SpaceType);
    } catch (error) {
      throw new SpaceDbError(error as Error);
    }
  }

  constructor(private readonly document: Document<ObjectId, Record<never, never>, SpaceType> & SpaceType) {}

  public getValue<K extends keyof SpaceType>(key: K): SpaceType[K] {
    return this.document.get(key);
  }

  public async delete() {
    try {
      const result = await this.document.deleteOne();

      return result;
    } catch (error) {
      throw new SpaceDbError(error as Error);
    }
  }

  public async addImage(image: ImageType) {
    try {
      const images = this.document.get('images');

      const newImages = produce(images, (draft: ImageType[]) => {
        draft.push(image);

        return draft;
      });

      this.document.set('images', newImages);

      const result = await this.document.save();

      return result;
    } catch (error) {
      throw new SpaceDbError(error as Error);
    }
  }

  public async removeImage(imageUUID: UUIDType) {
    try {
      const images = this.document.get('images');

      const index = images.findIndex(({ uuid }) => uuid === imageUUID);

      assert(index !== -1, new SpaceImageNotFound(this.document.id, imageUUID));

      const newImages = produce(images, (draft) => {
        draft.splice(index, 1);
      });

      this.document.set('images', newImages);

      const result = await this.document.save();

      return result;
    } catch (error) {
      throw new SpaceDbError(error as Error);
    }
  }

  public async upsert(newValues: Partial<Omit<SpaceType, 'id' | 'images'>>) {
    try {
      const keysToUpdate = Object.keys(newValues) as Array<keyof typeof newValues>;

      keysToUpdate.forEach((key) => {
        this.document.set(key, newValues[key]);
      });

      const result = await this.document.save();

      return result;
    } catch (error) {
      throw new SpaceDbError(error as Error);
    }
  }
}
