import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig, RedisConfig } from 'src/shared/config';
import entities from './entities';
import repos from './repository';
import subcribers from './subcribers';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (confService: ConfigService) => {
        const dbConfig = confService.get<DatabaseConfig>('database');
        const redisConfig = confService.get<RedisConfig>('redis');
        return {
          type: 'mysql',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.name,
          poolSize: 100,
          entities: [...entities],
          synchronize: true,
          autoLoadEntities: true,
          logging: true,
          connectorPackage: 'mysql2',
          cache: {
            type: 'redis',
            options: {
              host: redisConfig.host,
              port: redisConfig.port,
              user: redisConfig.user,
              password: redisConfig.pass,
              db: redisConfig.db,
            },
          },
        };
      },
    }),
    TypeOrmModule.forFeature([...entities]),
  ],
  providers: [...repos, ...subcribers],
  exports: [...repos],
})
export class DatabaseModule {}
