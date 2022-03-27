import { CacheModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisService } from './services/redis.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('REDIS_HOST'),
        store: redisStore,
        port: configService.get<string>('REDIS_PORT'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
