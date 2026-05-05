import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { MetricsService } from "./metrics.service";

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap(() => {
        this.metrics.incrementHttpRequest(
          req.method,
          req.route?.path || req.path,
          res.statusCode,
        );
      }),
      catchError((error) => {
        const statusCode = error instanceof HttpException ? error.getStatus() : 500;

        this.metrics.incrementHttpRequest(
          req.method,
          req.route?.path || req.path,
          statusCode,
        );

        return throwError(() => error);
      }),
    );
  }
}
