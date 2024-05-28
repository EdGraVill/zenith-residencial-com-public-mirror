import mongoose from 'mongoose';
import type { SchemaOptions, Schema } from 'mongoose';

const schemas: Record<string, Schema> = {};

export const modelGetter =
  <ST>(modelName: string, schema: Schema<ST>) =>
  () => {
    if (process.env.NODE_ENV !== 'production') {
      schemas[modelName] = schema;

      // This will help for development & testing process
      delete mongoose.models[modelName];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (mongoose as any).modelSchemas[modelName];

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
