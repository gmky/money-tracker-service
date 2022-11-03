import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { User } from 'src/database/entities';
import { ApiPaginatedResponse } from 'src/shared/decors';
import { OkResDto, PaginatedResDto } from 'src/shared/dto';
import { str } from 'src/shared/utils';
import {
  AdminCreateUserReqDto,
  AdminFilterUserReqDto,
  AdminUpdateUserReqDto,
} from '../dto/req';
import { UserService } from '../services';

@ApiBearerAuth()
@ApiTags('Admin / User')
@Controller('admin/users')
export class UserController {
  private readonly log = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: OkResDto })
  @ApiOperation({ summary: 'Create user manually' })
  async create(@Body() body: AdminCreateUserReqDto): Promise<OkResDto> {
    this.log.debug(`Admin create user with data: ${str(body)}`);
    await this.userService.createUser(body);
    return new OkResDto('User created');
  }

  @Get('filter')
  @ApiPaginatedResponse(User)
  @ApiOperation({ summary: 'Filter users with pagination' })
  async filter(
    @Query() data: AdminFilterUserReqDto,
  ): Promise<PaginatedResDto<User>> {
    this.log.debug(`Filter users with data: ${str(data)}`);
    return this.userService.filter(data);
  }

  @Get(':id')
  @ApiOkResponse({ type: User })
  @ApiOperation({ summary: `Get user's profile by ID` })
  async getProfileById(@Param('id') id: number): Promise<Partial<User>> {
    this.log.debug(`Get profile of user by ID: ${id}`);
    return this.userService.getProfileById(id);
  }

  @Put(':id')
  @ApiOkResponse({ type: OkResDto })
  @ApiOperation({ summary: `Update user's profile by ID` })
  async updateById(
    @Param('id') id: number,
    @Body() body: AdminUpdateUserReqDto,
  ): Promise<OkResDto> {
    this.log.debug(`Update user by ID: ${id} with data: ${str(body)}`);
    await this.userService.updateById(id, body);
    return new OkResDto('User updated');
  }

  @Delete(':id/delete')
  @ApiOkResponse({ type: OkResDto })
  @ApiOperation({ summary: 'Soft delete user by ID' })
  async softDelete(@Param('id') id: number): Promise<OkResDto> {
    this.log.debug(`Soft delete user by ID: ${id}`);
    await this.userService.softDeleteById(id);
    return new OkResDto('User deleted');
  }

  @Delete(':id/force-delete')
  @ApiOkResponse({ type: OkResDto })
  @ApiOperation({ summary: 'Permanently delete user by ID' })
  async forceDelete(@Param('id') id: number): Promise<OkResDto> {
    this.log.debug(`Force delete user by ID: ${id}`);
    return new OkResDto('User deleted');
  }
}
