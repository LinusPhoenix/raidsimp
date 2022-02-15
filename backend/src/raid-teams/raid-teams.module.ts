import { Module } from "@nestjs/common";
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm";
import { Collaborator } from "src/entities/collaborator.entity";
import { RaidTeam } from "src/entities/raid-team.entity";
import { Repository } from "typeorm";
import { AccessService } from "./access.service";
import { CollaboratorsService } from "./collaborators.service";
import { RaidTeamsController } from "./raid-teams.controller";
import { RaidTeamsService } from "./raid-teams.service";

@Module({
    imports: [TypeOrmModule.forFeature([RaidTeam, Collaborator])],
    providers: [RaidTeamsService, CollaboratorsService, AccessService],
    controllers: [RaidTeamsController],
    exports: [AccessService],
})
export class RaidTeamsModule {}
