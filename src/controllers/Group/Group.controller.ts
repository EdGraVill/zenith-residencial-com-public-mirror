import type { CommonDocumentType } from '@/db/commonSchemas';
import { CommonController } from '../CommonControllers';
import { getGroupModel, type GroupType } from '@/db/Group.model';
import { GroupNotFound } from './errors';
import assert from 'assert';

export type GroupDocumentType = CommonDocumentType<GroupType>;

export default class Group extends CommonController<GroupType> {
  private static readonly model = getGroupModel();

  public static async getById(id: GroupType['id']) {
    const group = await this.dbManipulation(() => this.model.findById<GroupDocumentType>(id));

    assert(group, new GroupNotFound(id));

    return new Group(group);
  }
}
