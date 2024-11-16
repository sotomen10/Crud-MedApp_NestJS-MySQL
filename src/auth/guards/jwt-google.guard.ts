import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activateResult = (await super.canActivate(context)) as boolean;

    if (!activateResult) {
      return false; 
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    return true;
  }
}
