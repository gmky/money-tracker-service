import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from 'src/shared/config';
import { User, Wallet } from './entities';
import { WalletRepo } from './repository';
import { UserRepo } from './repository/user.repo';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (confService: ConfigService) => {
        const dbConfig = confService.get<DatabaseConfig>('database');
        return {
          type: 'mysql',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.name,
          poolSize: 100,
          entities: [User, Wallet],
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
    TypeOrmModule.forFeature([User, Wallet]),
  ],
  providers: [UserRepo, WalletRepo],
  exports: [UserRepo, WalletRepo],
})
export class DatabaseModule {}
