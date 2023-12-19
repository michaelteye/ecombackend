
import { RequestContext } from '@medibloc/nestjs-request-context';
import { AuthUserRole } from '../types/auth-user.roles';
import { authEntity as AuthUserEntity } from '../entities/authUser.entity';

export class AppRequestContext extends RequestContext {
  authUser: AuthUserEntity;
  rolesMap: Partial<Record<AuthUserRole, boolean>>;
  locale: string;
}
