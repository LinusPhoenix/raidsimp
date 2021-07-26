import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RaidTeamsModule } from './raid-teams/raid-teams.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    RaidTeamsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
