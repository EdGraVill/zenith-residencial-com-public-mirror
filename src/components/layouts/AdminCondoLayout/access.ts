import { AccessTypeEnum } from '@/db/Persona.model';

const adminAccess = [
  AccessTypeEnum.ADMIN,
  AccessTypeEnum.CREATOR,
  AccessTypeEnum.DEVELOPER,
  AccessTypeEnum.SALES,
  AccessTypeEnum.SUPPORT,
] as const;

export default adminAccess;
