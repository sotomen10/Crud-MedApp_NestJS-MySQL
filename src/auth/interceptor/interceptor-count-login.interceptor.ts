import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoginCountInterceptor implements NestInterceptor {
  private loginCount = 0;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.url === '/auth/signin' && request.method === 'POST') {
      this.loginCount++;
      console.log(`Número de logins: ${this.loginCount}`);
    }

    return next.handle().pipe(
      tap(() => {
      }),
    );
  }

  getLoginCount(): number {
    return this.loginCount;
  }
}
