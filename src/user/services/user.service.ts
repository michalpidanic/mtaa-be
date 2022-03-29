import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { catchError, from, map, throwError } from 'rxjs';
import { mapUserWithoutPasswordHash } from 'src/common/utils/user-mapper';
import { Repository } from 'typeorm';
import { NewUserInterface, UserNotificationsInterface } from '../interfaces/user.interface';
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
    return from(this.userRepository.findOne({ where: { id: id } })).pipe(
      mapUserWithoutPasswordHash(),
    );
  }

  public changeNotificationSettings(notifications: UserNotificationsInterface, userId)
  {

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
}
