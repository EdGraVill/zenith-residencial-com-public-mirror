import mongoose from 'mongoose';
import type { SchemaOptions, Schema } from 'mongoose';

let storedConnection: typeof mongoose | null = null;

export async function connectDB() {
  if (!storedConnection) {
    storedConnection = await mongoose.connect(process.env.MONGODB_URI ?? '', {});
  }

  if (storedConnection.connection.readyState !== 1) {
    storedConnection = await mongoose.connect(process.env.MONGODB_URI ?? '', {});
  }

  return storedConnection;
}

const schemas: Record<string, Schema> = {};

export const modelGetter =
  <ST>(modelName: string, schema: Schema<ST>) =>
  () => {
    if (process.env.NODE_ENV !== 'production') {
      schemas[modelName] = schema;

      // This will help for development & testing process
      delete mongoose.models[modelName];

      Object.keys(schemas).forEach((mn) => {
        mongoose.model(mn, schemas[mn]);
      });
    }

    try {
      const Model = mongoose.model<ST>(modelName);

      return Model;
    } catch (error) {
      return mongoose.model<ST>(modelName, schema);
    }
  };

export function withTimestampsAndId<O extends SchemaOptions>(options: O): O {
  options.timestamps = {
    createdAt: 'timestamps.createdAt',
    updatedAt: 'timestamps.updatedAt',
  };
  options.id = true;

  return options;
}
