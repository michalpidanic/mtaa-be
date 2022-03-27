import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { lastValueFrom, map, take } from 'rxjs';
import { RedisService } from 'src/redis/services/redis.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    const refreshToken = req.body.refreshToken;

    // check if refresh token is in redis
    const res = await lastValueFrom(
      this.redisService.get(refreshToken).pipe(
        take(1),
        map((res) => res),
      ),
    );

    // if token == '1' -> token is destroyed in redis after logout
    if (res == '1') {
      throw new UnauthorizedException();
    }

    // return payload for further processing in controller
    return payload;
  }
}
