import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaidTeamsModule } from './raid-teams/raid-teams.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    RaidTeamsModule
  ]
})
export class AppModule { }
