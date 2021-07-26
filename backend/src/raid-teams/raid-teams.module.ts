import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RaidTeam } from "src/entities/raid-team.entity";
import { RaidTeamsController } from "./raid-teams.controller";
import { RaidTeamsService } from "./raid-teams.service";

@Module({
    imports: [TypeOrmModule.forFeature([RaidTeam])],
    providers: [RaidTeamsService],
    controllers: [RaidTeamsController]
})
export class RaidTeamsModule { }