import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { instanceToPlain } from 'class-transformer';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/database/entities';
import { JwtConfig } from 'src/shared/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly confService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: confService.get<JwtConfig>('security.jwt').base64Secret,
    });
  }

  async validate(payload: Partial<User>): Promise<any> {
    const user = await this.authService.validate(payload);
    if (!user) throw new UnauthorizedException('Unauthorized');
    return instanceToPlain(user);
  }
}
