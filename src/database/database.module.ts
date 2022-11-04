import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from 'src/shared/config';
import { Plan, User, Wallet } from './entities';
import { Subcription } from './entities/subcription.entity';
import { SubcriptionRepo, WalletRepo } from './repository';
import { PlanRepo } from './repository/plan.repo';
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
          entities: [User, Wallet, Plan, Subcription],
          synchronize: true,
          autoLoadEntities: true,
          logging: true,
        };
      },
    }),
    TypeOrmModule.forFeature([User, Wallet, Plan, Subcription]),
  ],
  providers: [UserRepo, WalletRepo, PlanRepo, SubcriptionRepo],
  exports: [UserRepo, WalletRepo, PlanRepo, SubcriptionRepo],
})
export class DatabaseModule {}
