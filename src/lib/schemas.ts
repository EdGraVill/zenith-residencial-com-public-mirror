import { z } from 'zod';

export const waterTankerRequestComment = z.object({
  author: z.number(),
  comment: z.string(),
  createdAt: z.preprocess((val) => new Date(val as string), z.date()),
  id: z.number(),
})

export const requestSchema = z.object({
  comments: z.array(waterTankerRequestComment),
  createdAt: z.preprocess((val) => new Date(val as string), z.date()),
  house: z.number(),
  isTesting: z.boolean(),
  list: z.string(),
  requestStatus: z.enum(['pending', 'completed', 'cancelled']),
  street: z.string(),
  updatedAt: z.preprocess((val) => new Date(val as string), z.date()),
  uuid: z.string().uuid(),
});

export const listSchema = z.object({
  description: z.string(),
  id: z.number(),
  list: z.array(requestSchema),
  name: z.string(),
})

export const listsSchema = z.record(listSchema);
