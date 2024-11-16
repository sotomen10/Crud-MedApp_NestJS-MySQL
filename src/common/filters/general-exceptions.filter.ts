import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.getStatus(exception);
    const message = this.getMessage(exception);

    this.logError(exception, status, request.url);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  private getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus(); // Get status from HttpException if available
    }
    return HttpStatus.INTERNAL_SERVER_ERROR; // Default to 500 if no specific status
  }

  private getMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return response; 
      }
      return (response as { message?: string }).message || 'Generic error';
    } else if (exception instanceof Error) {
      return exception.message || 'Generic error';
    }
    return 'Generic error';
  }

  private logError(exception: unknown, status: number, url: string): void {
    console.error('Error occurred:', {
      status,
      message: exception instanceof Error ? exception.message : exception,
      path: url,
      timestamp: new Date().toISOString(),
      stack: exception instanceof Error ? exception.stack : null, 
    });
  }
}
