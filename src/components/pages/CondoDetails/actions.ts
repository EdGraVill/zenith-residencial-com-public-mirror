'use server';

import Condo from '@/controllers/Condo';
import type { CommonIdType } from '@/db/commonSchemas';
import type { CondoType } from '@/db/Condo.model';
import assert from '@/utils/assert';

export async function editCondoProperty(condoId: CommonIdType, property: keyof CondoType, value: string) {
  const condo = await Condo.getById(condoId);

  assert(condo, () => new Error('Condo not found'));

  condo.setValue(property, value);
  await condo.save();

  return value;
}
