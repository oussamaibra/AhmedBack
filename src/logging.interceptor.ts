import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { isNil, isEmpty } from 'lodash';
import { Observable } from 'rxjs';
import { UserService } from './user/user.service';
import mongoose from 'mongoose';
// import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  constructor(private userService: UserService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // const request = context.switchToHttp().getRequest();
    // const headers = request.headers;

    // if (
    //   !isNil(headers?.userid) &&
    //   !isEmpty(headers?.userid) &&
    //   mongoose.isValidObjectId(headers?.userid)
    // ) {
    //   await this.userService.updateIsOnline(headers?.userid, true);
    // }

    // const now = Date.now();
    return next.handle();
    //   .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
