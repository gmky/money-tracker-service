import { Module } from '@nestjs/common';
import controllers from './controllers';
import services from './services';

@Module({
  imports: [],
  providers: [...services],
  controllers: [...controllers],
})
export class AdminModule {}
