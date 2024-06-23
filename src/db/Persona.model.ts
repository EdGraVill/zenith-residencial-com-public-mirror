import { Schema } from 'mongoose';
import {
  AdditionaInfoEntrySchema,
  CommonId,
  FileSchema,
  ImageSchema,
  type AdditionaInfoEntryType,
  type CommonSchemaType,
  type FileType,
  type ImageType,
} from './commonSchemas';
import { modelGetter, withTimestampsAndId } from './util';
import { hash } from 'bcrypt';

export type OAuthConnectionType = CommonSchemaType<{
  emailAddressAssociated: string;
  expirationDate: Date;
  token: string;
}>;

export enum AccessTypeEnum {
  ADMIN = 'ADMIN',
  COUNSELOR = 'COUNSELOR',
  CREATOR = 'CREATOR',
  DEMO = 'DEMO',
  DEVELOPER = 'DEVELOPER',
  ON_HOLD = 'ON_HOLD',
  RESIDENT = 'RESIDENT',
  TENANT = 'TENANT',
  TESTER = 'TESTER',
  VISITOR = 'VISITOR',
}

export enum LoginTypeEnum {
  MAGIC_LINK = 'MAGIC_LINK',
  OAUTH = 'OAUTH',
  PASSKEY = 'PASSKEY', // TODO: Implement
  PASSWORD = 'PASSWORD',
}

export const OAuthConnectionSchema = new Schema<OAuthConnectionType>(
  {
    emailAddressAssociated: {
      required: true,
      type: String,
    },
    expirationDate: {
      required: true,
      type: Date,
    },
    token: {
      required: true,
      type: String,
    },
  },
  withTimestampsAndId({}),
);

export enum PersonaSharableInfoEnum {
  ADDITIONAL_EMAIL_ADDRESSES = 'ADDITIONAL_EMAIL_ADDRESSES',
  ADDITIONAL_PHONE_NUMBERS = 'ADDITIONAL_PHONE_NUMBERS',
  FIRST_NAME = 'FIRST_NAME',
  HOUSE_NUMBER = 'HOUSE_NUMBER',
  LAST_NAME = 'LAST_NAME',
  NICKNAME = 'NICKNAME',
  PRIMARY_EMAIL_ADDRESS = 'PRIMARY_EMAIL_ADDRESS',
  PRIMARY_PHONE_NUMBER = 'PRIMARY_PHONE_NUMBER',
  PROFILE_PICTURE = 'PROFILE_PICTURE',
}

export type PersonaType = CommonSchemaType<{
  accessType: AccessTypeEnum;
  additionalInfoEntry: AdditionaInfoEntryType[];
  emailAddresses: string[];
  files: FileType[];
  firstName: string;
  images: ImageType[];
  lastName: string;
  nickname?: string;
  oAuthConnection: {
    apple?: OAuthConnectionType;
    facebook?: OAuthConnectionType;
    google?: OAuthConnectionType;
  };
  password?: string;
  phoneNumbers: string[];
  primaryAuthMethod: LoginTypeEnum;
  primaryEmailAddress?: string;
  primaryPhoneNumber?: string;
  profilePictureId?: ImageType['id'];
  sharedInfo: PersonaSharableInfoEnum[];
}>;

export const PersonaSchema = new Schema<PersonaType>(
  {
    accessType: {
      enum: Object.values(AccessTypeEnum),
      required: true,
      type: String,
    },
    additionalInfoEntry: {
      default: [],
      required: true,
      type: [AdditionaInfoEntrySchema],
    },
    emailAddresses: {
      default: [],
      required: true,
      type: [String],
    },
    files: {
      default: [],
      required: true,
      type: [FileSchema],
    },
    firstName: {
      required: true,
      type: String,
    },
    images: {
      default: [],
      required: true,
      type: [ImageSchema],
    },
    lastName: {
      required: true,
      type: String,
    },
    nickname: {
      type: String,
    },
    oAuthConnection: {
      apple: {
        type: OAuthConnectionSchema,
      },
      facebook: {
        type: OAuthConnectionSchema,
      },
      google: {
        type: OAuthConnectionSchema,
      },
    },
    password: {
      async set(value: string) {
        const hashed = await hash(value, 10);

        return hashed;
      },
      type: String,
    },
    phoneNumbers: {
      default: [],
      required: true,
      type: [String],
    },
    primaryAuthMethod: {
      enum: Object.values(LoginTypeEnum),
      required: true,
      type: String,
    },
    primaryEmailAddress: {
      type: String,
    },
    primaryPhoneNumber: {
      type: String,
    },
    profilePictureId: {
      type: CommonId,
      validate: {
        message: 'Image does not exist',
        validator(this: PersonaType, value: ImageType['id']) {
          if (!this.images.some((image) => image.id === value)) {
            return false;
          }

          return true;
        },
      },
    },
    sharedInfo: {
      default: [],
      enum: Object.values(PersonaSharableInfoEnum),
      required: true,
      type: [String],
    },
  },
  withTimestampsAndId({}),
);

export const PersonaModelName = 'Persona';
export const getPersonaModel = modelGetter(PersonaModelName, PersonaSchema);
