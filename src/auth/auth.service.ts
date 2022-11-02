import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { instanceToPlain } from 'class-transformer';
import { User } from 'src/database/entities';
import { UserRepo } from 'src/database/repository/user.repo';
import { RegisterReqDto } from './req/register.dto';
import { LoginResDto } from './res';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepo: UserRepo,
    private readonly jwtService: JwtService,
  ) {}

  async validate(payload: Partial<User>): Promise<Partial<User>> {
    const user = await this.userRepo.findActiveByUsername(payload.username);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async login(username: string, password: string): Promise<LoginResDto> {
    const user = await this.userRepo.findActiveByUsername(username);
    if (!user) throw new NotFoundException('User not found');
    const passwordCheck = compareSync(password, user.password);
    if (!passwordCheck) throw new UnauthorizedException('Unauthorized');
    const accessToken = this.jwtService.sign(instanceToPlain(user));
    return {
      accessToken,
      info: instanceToPlain(user),
    };
  }

  async register(dto: RegisterReqDto): Promise<Partial<User>> {
    const existed = await this.userRepo.findOneByUsername(dto.username);
    if (existed) throw new BadRequestException('User already existed');
    const result = await this.userRepo.save(dto as User);
    return instanceToPlain(result);
  }

  async profile(id: number): Promise<Partial<User>> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return instanceToPlain(user);
  }

  async forgotPassword(email: string): Promise<boolean> {
    const existed = await this.userRepo.findByEmail(email);
    if (!existed) throw new NotFoundException('User not found');
    return true;
  }

  async resetPassword(userId: number, password: string): Promise<void> {
    const existed = await this.userRepo.findById(userId);
    if (!existed) throw new NotFoundException('User not found');
    existed.password = password;
    existed.isPasswordChanged = true;
    await this.userRepo.save(existed);
  }
}
