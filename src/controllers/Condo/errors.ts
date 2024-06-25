import CommonError from '@/CommonError';
import type { CondoType } from '@/db/Condo.model';
import type { NewCondoInputType } from './inputSchemas';

export class CondoNotFound extends CommonError {
  constructor(condoId: CondoType['id']) {
    super('Condo not found');

    this.name = 'CondoNotFound';

    this.log(`Condo with id ${condoId} not found`, this);
  }
}

export class InvalidNewCondoInput extends CommonError {
  constructor(newCondoInput: NewCondoInputType) {
    super('Invalid new condo input');

    this.name = 'InvalidNewCondoInput';

    this.log(`Invalid new condo input: ${JSON.stringify(newCondoInput, undefined, 2)}`, this);
  }
}
