import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Plan } from 'src/database/entities';
import { AnyRole, ApiPaginatedResponse } from 'src/shared/decors';
import { PaginatedResDto } from 'src/shared/dto';
import { UserRoleEnum } from 'src/shared/enum';
import { str } from 'src/shared/utils';
import { CreatePlanReqDto } from '../dto/req/create-plan.req.dto';
import { AdminFilterPlanReqDto } from '../dto/req/filter-plan.req.dto';
import { PlanService } from '../services';

@ApiBearerAuth()
@Controller('plan')
@ApiTags('Admin / Plan')
@AnyRole(UserRoleEnum.ADMIN, UserRoleEnum.STAFF)
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

  @Get('filter')
  @ApiPaginatedResponse(Plan)
  @ApiOperation({ summary: 'Filter plan with pagination' })
  async filter(
    @Query() body: AdminFilterPlanReqDto,
  ): Promise<PaginatedResDto<Plan>> {
    this.log.debug(`Filter plan with data: ${str(body)}`);
    return this.planService.filter(body);
  }
}
