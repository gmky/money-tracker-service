import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { isEmail } from 'class-validator';
import { User } from 'src/database/entities';
import { CurrentUser } from 'src/shared/decors';
import { Public } from 'src/shared/decors/public.decor';
import { OkResDto } from 'src/shared/dto';
import { str } from 'src/shared/utils';
import { AuthService } from './auth.service';
import { LoginReqDto, RegisterReqDto, ResetPasswordReqDto } from './dto/req';
import { LoginResDto } from './dto/res';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  private readonly log = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginResDto })
  @ApiOperation({ summary: 'Login with username and password' })
  async login(@Body() body: LoginReqDto): Promise<LoginResDto> {
    this.log.debug(`Login with data: ${str(body, 'password')}`);
    return await this.authService.login(body.username, body.password);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: User })
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() body: RegisterReqDto): Promise<Partial<User>> {
    this.log.debug(`Register with data: ${str(body, 'password')}`);
    return await this.authService.register(body);
  }

  @ApiBearerAuth()
  @Get('profile')
  @ApiOkResponse({ type: User })
  @ApiOperation({ summary: `Get current's user profile` })
  async profile(@CurrentUser() user: Partial<User>): Promise<Partial<User>> {
    this.log.debug(`Get profile of user: ${user.username}`);
    return this.authService.profile(user.id);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('forgot-password')
  @ApiOkResponse({ type: OkResDto })
  @ApiOperation({ summary: 'Request forgot password link by email' })
  async forgotPassword(@Query('email') email: string): Promise<OkResDto> {
    this.log.debug(`Forgot password request with email: ${email}`);
    if (isEmail(email)) throw new BadRequestException('Invalid email format');
    return new OkResDto('An link was sent to your email address');
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: OkResDto })
  @ApiOperation({ summary: 'Reset password' })
  async resetPassword(
    @CurrentUser() user: Partial<User>,
    @Body() body: ResetPasswordReqDto,
  ): Promise<OkResDto> {
    this.log.debug(`Reset password for user: ${user.username}`);
    await this.authService.resetPassword(user.id, body.password);
    return new OkResDto('Password was reset. Please login again');
  }
}
