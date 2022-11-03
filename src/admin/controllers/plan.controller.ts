import { Body, Controller, Logger, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Plan } from 'src/database/entities';
import { AnyRole } from 'src/shared/decors';
import { UserRoleEnum } from 'src/shared/enum';
import { str } from 'src/shared/utils';
import { CreatePlanReqDto } from '../dto/req/create-plan.req.dto';
import { PlanService } from '../services';

@ApiTags('Admin / Plan')
@ApiBearerAuth()
@AnyRole(UserRoleEnum.ADMIN, UserRoleEnum.STAFF)
@Controller('plan')
export class PlanController {
  private readonly log = new Logger(PlanController.name);

  constructor(private readonly planService: PlanService) {}

  @Post()
  @ApiOkResponse({ type: Plan })
  @ApiOperation({ summary: 'Create new plan' })
  async create(@Body() body: CreatePlanReqDto): Promise<Plan> {
    this.log.debug(`Create new plan with data: ${str(body)}`);
    return this.planService.create(body);
  }
}
