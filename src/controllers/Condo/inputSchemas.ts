import { z } from 'zod';

export const newCondoInputSchema = z.object({
  address: z.string().min(1),
  city: z.string().min(2),
  contact: z.object({
    email: z.string().email(),
    name: z.string().min(1),
    phone: z.string().min(10),
  }),
  country: z.string().min(2),
  description: z.string().optional(),
  email: z.string().email(),
  entranceCoordinates: z.tuple([z.number(), z.number()]).readonly().optional(),
  limitsCoordinates: z.array(z.tuple([z.number(), z.number()])).optional(),
  name: z.string().min(3),
  phone: z.string().min(10),
  postalCode: z.string().min(5).max(5),
  services: z.array(z.string()),
  socialMedia: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
  }),
  state: z.string().min(2),
  website: z.string().optional(),
});
export type NewCondoInputType = z.infer<typeof newCondoInputSchema>;
