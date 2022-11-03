import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtConfig } from 'src/shared/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy, JwtAuthGuard, RoleGuard } from './strategy';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (confService: ConfigService) => {
        const jwtConfig = confService.get<JwtConfig>('security.jwt');
        return {
          secret: jwtConfig.base64Secret,
          signOptions: {
            expiresIn: jwtConfig.tokenValidityInSeconds,
            issuer: jwtConfig.issuer,
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RoleGuard],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
