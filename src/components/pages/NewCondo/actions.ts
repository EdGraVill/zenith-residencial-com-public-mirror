'use server';

import Condo, { newCondoInputSchema } from '@/controllers/Condo';
import Persona from '@/controllers/Persona';
import yn from 'yn';

export interface CreateCondoState {
  condoId?: string;
  errorMessage?: string;
}

export async function createCondo(_prevState: CreateCondoState, formData: FormData): Promise<CreateCondoState> {
  console.log('formData', formData);

  try {
    const persona = await Persona.getWithCurrentSession();

    const newCondoInput = newCondoInputSchema.parse({
      address: formData.get('address'),
      city: formData.get('city'),
      contact: {
        email: formData.get('contactEmail'),
        name: formData.get('contactName'),
        phone: formData.get('contactPhone'),
      },
      country: formData.get('country'),
      description: formData.get('description'),
      email: formData.get('email'),
      entranceCoordinates: yn(formData.get('hasEntranceCoordinates'))
        ? [formData.get('entranceLat'), formData.get('entranceLng')]
        : undefined,
      name: formData.get('name'),
      phone: formData.get('phone'),
      postalCode: formData.get('postalCode'),
      services: formData.getAll('service'),
      socialMedia: {
        facebook: formData.get('facebook'),
        instagram: formData.get('instagram'),
        linkedin: formData.get('linkedin'),
        twitter: formData.get('twitter'),
      },
      state: formData.get('state'),
      website: formData.get('website'),
    });

    const newCondo = await Condo.create(persona.id, newCondoInput);

    return { condoId: newCondo.id.toString() };
  } catch (error) {
    if (error instanceof Error) {
      return { errorMessage: error.message };
    }

    return { errorMessage: 'An unknown error occurred' };
  }
}
