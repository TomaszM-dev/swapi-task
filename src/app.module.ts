import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CachedResource } from '../cached-resource.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './data/database.db',
      entities: [CachedResource],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([CachedResource]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
