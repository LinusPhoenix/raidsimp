import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CachedOverview } from "src/entities/cached-overview.entity";
import { RaidTeam } from "src/entities/raid-team.entity";
import { Raider } from "src/entities/raider.entity";
import { RaidTeamsModule } from "src/raid-teams/raid-teams.module";
import { RaidersController } from "./raiders.controller";
import { RaidersService } from "./raiders.service";

@Module({
    imports: [TypeOrmModule.forFeature([RaidTeam, Raider, CachedOverview]), RaidTeamsModule],
    providers: [RaidersService],
    controllers: [RaidersController],
})
export class RaidersModule {}
