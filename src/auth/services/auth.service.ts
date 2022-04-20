import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { catchError, concatMap, map, of, take, throwError } from 'rxjs';
import { RedisService } from 'src/redis/services/redis.service';
import { NewUserInterface } from 'src/user/interfaces/user.interface';
import { UserService } from 'src/user/services/user.service';
import { LoginCredentialsDto, RegistrationDto } from '../dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { mapUserWithoutPasswordHash } from 'src/common/utils/user-mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  // register method
  public register(user: RegistrationDto) {
    const newUser: NewUserInterface = {
      userName: user.userName,
      passwordHash: this.getPasswordHash(user.password),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return this.userService
      .createUser(newUser)
      .pipe(take(1), mapUserWithoutPasswordHash());
  }

  // login method
  public login(credentials: LoginCredentialsDto) {
    return this.userService.findUserByUserName(credentials.userName).pipe(
      take(1),
      map((user) => {
        if (
          user &&
          this.comparePasswordHash(credentials.password, user.passwordHash)
        ) {
          return this.generateTokens({
            userId: user.id,
            userName: user.userName,
          });
        } else {
          throw new UnauthorizedException('Invalid credentials');
        }
      }),
      catchError((err) => {
        console.log(err);
        return throwError(
          () =>
            new HttpException(err?.data ?? 'Unknown error', err?.status ?? 500),
        );
      }),
    );
  }

  // logout method
  public logout(accessToken: string, refreshToken: string) {
    return this.expireToken(accessToken, 'ACCESS').pipe(
      take(1),
      concatMap(() => this.expireToken(refreshToken, 'REFRESH')),
      map(() => 'OK'),
    );
  }

  // refresh token method
  public refreshToken(refreshToken: string) {
    const decodedRefreshToken = this.jwtService.decode(refreshToken);
    const payload = {
      userId: decodedRefreshToken['userId'],
      userName: decodedRefreshToken['userName'],
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: +this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
    });

    return { accessToken: accessToken };
  }

  /*
   ********************
   * utility functions*
   ********************
   */

  // function returns bcrypt hash of password
  private getPasswordHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  // function compares bcrypt password hash with password and returns boolean
  private comparePasswordHash(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  // function generates access and refresh tokens
  private generateTokens(payload: { userId: number; userName: string }) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: +this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: +this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      userName: payload.userName,
      userId: payload.userId,
    };
  }

  // function expires token and always returns 'OK'
  private expireToken(token: string, type: string) {
    // verify token
    try {
      this.jwtService.verify(token, {
        secret: this.configService.get<string>(`${type}_TOKEN_SECRET`),
      });
    } catch (error) {
      console.log(`Invalid ${type} token ${token}`);
      console.log(error);
      return of('OK');
    }

    // get token expiration and calculate ttl
    const expiration = this.jwtService.decode(token)['exp'];
    const ttl = parseInt((expiration - Date.now() / 1000).toFixed(0));

    // set token to redis
    return this.redisService.set(token, '1', ttl).pipe(
      take(1),
      map(() => of('OK')),
      catchError((error) => {
        console.log(`Failed to expire ${type} token ${token}`);
        console.log(error);
        return of('OK');
      }),
    );
  }
}
