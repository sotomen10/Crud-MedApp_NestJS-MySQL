import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoginCountInterceptor implements NestInterceptor {
  private loginCount = 0;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Verifica si la ruta actual es la de login
    if (request.url === '/auth/signin' && request.method === 'POST') {
      this.loginCount++;
      console.log(`Número de logins: ${this.loginCount}`);
    }

    return next.handle().pipe(
      tap(() => {
        // Aquí podrías realizar otras acciones si es necesario
      }),
    );
  }

  // O puedes tener un método para obtener el conteo actual
  getLoginCount(): number {
    return this.loginCount;
  }
}
