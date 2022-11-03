import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { PlanController } from './controllers/plan.controller';
import { PlanService, UserService } from './services';

@Module({
  imports: [],
  providers: [UserService, PlanService],
  controllers: [UserController, PlanController],
})
export class AdminModule {}
