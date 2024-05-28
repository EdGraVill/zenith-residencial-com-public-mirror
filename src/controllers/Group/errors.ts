import CommonError from '@/CommonError';
import type { GroupType } from '@/db/Group.model';

export class GroupNotFound extends CommonError {
  constructor(groupId: GroupType['id']) {
    super(`Group not found`);

    this.name = 'GroupNotFound';

    this.log(`Group with id ${groupId} not found\n`, this);
  }
}
