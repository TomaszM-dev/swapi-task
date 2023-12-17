import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CachedResource } from '../cached-resource.entity';

import { AppController } from './app.controller';
import { AppService } from './app.service';

type TypeORMDbType = 'sqlite';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as TypeORMDbType) || 'sqlite',
      database: process.env.DB_DATABASE || './data/database.db',
      entities: [CachedResource],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    }),
    TypeOrmModule.forFeature([CachedResource]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
