import type { Schema } from 'mongoose';
import mongoose from 'mongoose';

const schemas: Record<string, Schema> = {};

export const modelGetter = (modelName: string, schema: Schema) => () => {
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
    const Model = mongoose.model<typeof schema>(modelName);

    return Model;
  } catch (error) {
    return mongoose.model<typeof schema>(modelName, schema);
  }
};
