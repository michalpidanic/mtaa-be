import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  constructor(private errorMessage: string) {}

  intercept(context: ExecutionContext, stream$: CallHandler): Observable<any> {
    return stream$.handle().pipe(
      tap((data) => {
        if (data === undefined) {
          throw new NotFoundException(this.errorMessage);
        }
      }),
    );
  }
}
