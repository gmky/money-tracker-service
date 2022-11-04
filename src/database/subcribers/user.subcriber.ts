import { CacheKeyEnum } from 'src/shared/enum';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { User } from '../entities';

@EventSubscriber()
export class UserSubcriber implements EntitySubscriberInterface<User> {
  constructor(private readonly ds: DataSource) {
    ds.subscribers.push(this);
  }
  listenTo() {
    return User;
  }
  afterUpdate(event: UpdateEvent<User>): void | Promise<any> {
    this.ds.queryResultCache.remove([
      `${CacheKeyEnum.USER_BY_USERNAME_PREFIX}-${event.databaseEntity.username}`,
    ]);
  }
}
