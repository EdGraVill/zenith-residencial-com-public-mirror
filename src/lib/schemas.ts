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
  list: z.enum(['1', '2', '3', '4', '5', '6', '7']),
  status: z.enum(['pending', 'completed', 'cancelled']),
  street: z.string(),
  updatedAt: z.preprocess((val) => new Date(val as string), z.date()),
  uuid: z.string().uuid(),
  waterTankerName: z.string(),
});

export const waterTankerSchema = z.object({
  description: z.string(),
  id: z.number(),
  name: z.string(),
  requests: z.array(requestSchema),
})

export const waterTankersSchema = z.record(waterTankerSchema);

export const listEnum = z.enum(['1', '2', '3', '4', '5', '6', '7']);
export type List = z.infer<typeof listEnum>;
