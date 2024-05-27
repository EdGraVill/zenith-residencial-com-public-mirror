import { Schema } from 'mongoose';
import type { PersonaType } from './Persona.model';
import { AccessTypeEnum, PersonaModelName } from './Persona.model';
import type { CommonSchemaType } from './commonSchemas';
import { modelGetter, withTimestampsAndId } from './util';

export type GroupType = CommonSchemaType<{
  accessType: AccessTypeEnum;
  membersId: PersonaType['id'][];
  name: string;
  ownerId: PersonaType['id'];
}>;

export const GroupSchema = new Schema<GroupType>(
  {
    accessType: {
      enum: Object.values(AccessTypeEnum),
      required: true,
      type: String,
    },
    membersId: {
      default: [],
      ref: PersonaModelName,
      required: true,
      type: [Schema.Types.ObjectId],
    },
    name: {
      required: true,
      type: String,
    },
    ownerId: {
      ref: PersonaModelName,
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  withTimestampsAndId({}),
);

export const GroupModelName = 'Group';
export const getGroupModel = modelGetter(GroupModelName, GroupSchema);
