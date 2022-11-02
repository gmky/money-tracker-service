import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UserService } from './services';

@Module({
  imports: [],
  providers: [UserService],
  controllers: [UserController],
})
export class AdminModule {}
