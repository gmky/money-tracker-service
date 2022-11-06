import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AnyRole, ApiPaginatedResponse } from 'src/shared/decors';
import { OkResDto, Pageable, PaginatedResDto } from 'src/shared/dto';
import { UserRoleEnum } from 'src/shared/enum';
import { str } from 'src/shared/utils';
import { Subscription } from '../../database/entities';
import {
  AdminCreateSubReqDto,
  AdminFilterSubcriptionReqDto,
  AdminUpdateSubStatusReqDto,
} from '../dto/req';
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
  @ApiOperation({ summary: 'Create new subscription for user' })
  @ApiOkResponse({ type: Subscription })
  async createSub(
    @Body() body: AdminCreateSubReqDto,
  ): Promise<Partial<Subscription>> {
    this.log.debug(`Create subscription with data: ${str(body)}`);
    return this.subService.createSub(body);
  }

  @Put(':id/status')
  @ApiOkResponse({ type: OkResDto })
  @ApiOperation({ summary: 'Update subscription status by ID' })
  async updateSubscriptionStatus(
    @Param('id') id: number,
    @Body() body: AdminUpdateSubStatusReqDto,
  ): Promise<Partial<OkResDto>> {
    this.log.debug(`Update subscription status by ID: ${id}`);
    await this.subService.updateStatusById(id, body);
    return new OkResDto('Subscription updated');
  }

  @Delete(':id')
  @ApiOkResponse({ type: OkResDto })
  @ApiOperation({ summary: 'Delete subscription by ID' })
  async deleteById(@Param('id') id: number): Promise<OkResDto> {
    this.log.debug(`Delete subscription by ID: ${id}`);
    await this.subService.softDeleteById(id);
    return new OkResDto('Subscription deleted');
  }
}
