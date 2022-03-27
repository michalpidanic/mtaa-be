import { map } from 'rxjs';
import { UserEntityInterface } from 'src/user/interfaces/user.interface';

export const mapUserWithoutPasswordHash = <T = any>() =>
  map((user: UserEntityInterface) => {
    delete user.passwordHash;
    return user;
  });
