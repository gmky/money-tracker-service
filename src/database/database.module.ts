import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from 'src/shared/config';
import { User } from './entities';
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
          entities: [],
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserRepo],
  exports: [UserRepo],
})
export class DatabaseModule {}
