import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { from } from 'rxjs';

@Injectable()
export class RedisService {
  @Inject(CACHE_MANAGER) private readonly cache: Cache;

  get(key: string) {
    //get value from redis store
    return from(this.cache.get(key));
  }

  set(key: string, value: string, ttl = 3600) {
    //set value in redis store, ttl is 3600 seconds if it is not given otherwise
    return from(this.cache.set(key, value, { ttl: ttl }));
  }

  remove(key: string) {
    //remove value from redis store
    return from(this.cache.del(key));
  }

  reset() {
    //reset all values from redis store
    return from(this.cache.reset());
  }
}
