'use server';

import Condo from '@/controllers/Condo';
import type { CommonIdType } from '@/db/commonSchemas';
import assert from '@/utils/assert';

export async function editCondoProperty(
  condoId: CommonIdType,
  property: Parameters<typeof Condo.prototype.setValue>[0],
  value: string,
) {
  const condo = await Condo.getById(condoId);

  assert(condo, () => new Error('Condo not found'));

  condo.setValue(property, value);
  await condo.save();

  return value;
}
