import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { lastValueFrom, map, take } from 'rxjs';
import { RedisService } from 'src/redis/services/redis.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const accessToken = req.headers['authorization'].split(' ')[1];

    // check if access token is in redis
    const res = await lastValueFrom(
      this.redisService.get(accessToken).pipe(
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
