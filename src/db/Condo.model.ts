import { Schema } from 'mongoose';
import { ImageSchema, VideoSchema, type CommonSchemaType, type ImageType, type VideoType } from './commonSchemas';
import { modelGetter, withTimestampsAndId } from './util';

export type CoordinatesType = [lat: number, lng: number];

export type CondoType = CommonSchemaType<{
  address: string;
  city: string;
  contact: {
    email: string;
    name: string;
    phone: string;
  };
  country: string;
  description?: string;
  email: string;
  entranceCoordinates?: CoordinatesType;
  images: ImageType[];
  limitsCoordinates?: CoordinatesType[];
  logo?: ImageType;
  name: string;
  phone: string;
  postalCode: string;
  services: string[];
  socialMedia: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  state: string;
  videos: VideoType[];
  website?: string;
}>;

export const CondoSchema = new Schema<CondoType>(
  {
    address: {
      required: true,
      type: String,
    },
    city: {
      required: true,
      type: String,
    },
    contact: {
      email: {
        required: true,
        type: String,
      },
      name: {
        required: true,
        type: String,
      },
      phone: {
        required: true,
        type: String,
      },
    },
    country: {
      required: true,
      type: String,
    },
    description: {
      type: String,
    },
    email: {
      required: true,
      type: String,
    },
    entranceCoordinates: {
      type: [Number],
    },
    images: {
      default: [],
      required: true,
      type: [ImageSchema],
    },
    limitsCoordinates: {
      default: [],
      type: [[Number]],
    },
    logo: {
      type: ImageSchema,
    },
    name: {
      required: true,
      type: String,
    },
    phone: {
      required: true,
      type: String,
    },
    postalCode: {
      required: true,
      type: String,
    },
    services: {
      default: [],
      type: [String],
    },
    socialMedia: {
      facebook: {
        type: String,
      },
      instagram: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      twitter: {
        type: String,
      },
    },
    state: {
      required: true,
      type: String,
    },
    videos: {
      default: [],
      required: true,
      type: [VideoSchema],
    },
    website: {
      type: String,
    },
  },
  withTimestampsAndId({}),
);

export const CondoModelName = 'Condo';
export const getCondoModel = modelGetter(CondoModelName, CondoSchema);
