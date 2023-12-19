
import { AuthGuard } from "@nestjs/passport";
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local'){
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        console.log('User object in LocalAuthGuard:', request.user); // Log the 'user' object
        return super.canActivate(context);
      }
}
