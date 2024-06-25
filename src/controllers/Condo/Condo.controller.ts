import { getCondoModel, type CondoType } from '@/db/Condo.model';
import { CommonController } from '../CommonControllers';
import type { CommonDocumentType } from '@/db/commonSchemas';
import { CondoNotFound, InvalidNewCondoInput } from './errors';
import assert from '@/utils/assert';
import type { PersonaType } from '@/db/Persona.model';
import { newCondoInputSchema, type NewCondoInputType } from './inputSchemas';

export type CondoDocumentType = CommonDocumentType<CondoType>;

export default class Condo extends CommonController<CondoType> {
  private static readonly model = getCondoModel();

  public static async getById(id: CondoType['id']) {
    const condo = await this.dbManipulation(() => this.model.findById<CondoDocumentType>(id));

    assert(condo, () => new CondoNotFound(id));

    return new Condo(condo);
  }

  public static async create(creatorId: PersonaType['id'], newCondoInput: NewCondoInputType) {
    // TODO: Validate that the creator permissions allow creating a condo

    const { success } = await newCondoInputSchema.safeParseAsync(newCondoInput);

    assert(success, () => new InvalidNewCondoInput(newCondoInput));

    const newCondo = await this.dbManipulation(() => this.model.create(newCondoInput));

    return new Condo(newCondo as unknown as CondoDocumentType);
  }

  public static async getList() {
    const list = await this.dbManipulation(() => this.model.find<CondoDocumentType>());

    return list.map((condo) => new Condo(condo));
  }
}
