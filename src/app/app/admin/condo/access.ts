import { AccessTypeEnum } from '@/db/Persona.model';

const adminCondoAccess = [
  AccessTypeEnum.CREATOR,
  AccessTypeEnum.DEVELOPER,
  AccessTypeEnum.SALES,
  AccessTypeEnum.SUPPORT,
] as const;

export default adminCondoAccess;
