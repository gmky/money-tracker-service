import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AnyRole, ApiPaginatedResponse } from 'src/shared/decors';
import { Pageable, PaginatedResDto } from 'src/shared/dto';
import { UserRoleEnum } from 'src/shared/enum';
import { str } from 'src/shared/utils';
import { Subscription } from '../../database/entities';
import { AdminCreateSubReqDto, AdminFilterSubcriptionReqDto } from '../dto/req';
import { SubscriptionService } from '../services';

@ApiBearerAuth()
@ApiTags('Admin / Subcription')
@Controller('admin/subcriptions')
@AnyRole(UserRoleEnum.ADMIN, UserRoleEnum.STAFF)
export class SubscriptionController {
  private readonly log = new Logger(SubscriptionController.name);

  constructor(private readonly subService: SubscriptionService) {}

  @Get('filter')
  @ApiOperation({ summary: 'Filter subsciption' })
  @ApiPaginatedResponse(Subscription)
  async filter(
    @Query() data: AdminFilterSubcriptionReqDto,
    @Query() pageable: Pageable,
  ): Promise<PaginatedResDto<Subscription>> {
    this.log.debug(
      `Filter subscription with data: ${str(data)} and pagination: ${str(
        pageable,
      )}`,
    );
    return this.subService.filter(data, pageable);
  }

  @Get(':id')
  @ApiOkResponse({ type: Subscription })
  @ApiOperation({ summary: 'Get subscription by ID' })
  async findById(@Param('id') id: number): Promise<Partial<Subscription>> {
    this.log.debug(`Find subscription by ID: ${id}`);
    return this.subService.findById(id);
  }

  @Post()
  async createSub(
    @Body() body: AdminCreateSubReqDto,
  ): Promise<Partial<Subscription>> {
    this.log.debug(`Create subscription with data: ${str(body)}`);
    return this.subService.createSub(body);
  }
}
