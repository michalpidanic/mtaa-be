import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { catchError, from, map, throwError } from 'rxjs';
import { mapUserWithoutPasswordHash } from 'src/common/utils/user-mapper';
import { Repository } from 'typeorm';
import {
  NewUserInterface,
  UserNotificationsInterface,
} from '../interfaces/user.interface';
import { UserEntity } from '../models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // method creates new instance of user in DB and returns
  public createUser(user: NewUserInterface) {
    return from(this.userRepository.save(user)).pipe(
      catchError((err) => {
        console.log(JSON.stringify(err));
        return throwError(
          () => new HttpException(err.detail ?? 'Unknown DB error', 500),
        );
      }),
    );
  }

  // method finds user by userName and returns
  public findUserByUserName(userName: string) {
    return from(this.userRepository.findOne({ where: { userName: userName } }));
  }

  // method finds user by id and returns
  public findUserById(id: number) {
    return this.findOne(id).pipe(mapUserWithoutPasswordHash());
  }

  // method updates users notifications settings
  public changeNotificationSettings(
    notifications: UserNotificationsInterface,
    userId,
  ) {
    return from(
      this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .where({ id: userId })
        .set({
          messageNotifications: notifications.messageNotifications,
          mentionNotifications: notifications.mentionNotifications,
          callNotifications: notifications.callNotifications,
        })
        .execute(),
    );
  }

  // method paginates users and returns without passwordHash
  public getUsers(options: IPaginationOptions) {
    return from(paginate(this.userRepository, options)).pipe(
      map((res) => {
        res.items.map((item) => {
          delete item.passwordHash;
          return item;
        });
        return res;
      }),
    );
  }

  // method finds user by id and returns entity
  public findOne(userId: number) {
    return from(this.userRepository.findOne({ where: { id: userId } }));
  }
}
