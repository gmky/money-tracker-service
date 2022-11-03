import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '../enum';

export const ANY_ROLE_KEY = 'anyRole';

export const AnyRole = (...roles: UserRoleEnum[]) =>
  SetMetadata(ANY_ROLE_KEY, roles);
