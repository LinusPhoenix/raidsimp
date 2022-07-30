import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CollaboratorRole } from "src/commons/user-roles";
import { Collaborator } from "src/entities/collaborator.entity";
import { RaidTeam } from "src/entities/raid-team.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { AccessService } from "./access.service";

@Injectable()
export class CollaboratorsService {
    constructor(
        @InjectRepository(Collaborator) private collaboratorsRepository: Repository<Collaborator>,
        private readonly accessService: AccessService,
    ) {}

    async findByRaidTeam(user: User, raidTeamId: string): Promise<Collaborator[]> {
        const raidTeam: RaidTeam = await this.accessService.assertUserOwnsRaidTeam(
            user,
            raidTeamId,
        );

        return this.collaboratorsRepository.find({
            where: {
                raidTeam: { id: raidTeam.id },
            },
        });
    }

    async addOrUpdate(
        user: User,
        raidTeamId: string,
        battletag: string,
        role: CollaboratorRole,
    ): Promise<Collaborator> {
        const raidTeam: RaidTeam = await this.accessService.assertUserOwnsRaidTeam(
            user,
            raidTeamId,
        );

        await this.collaboratorsRepository.save({
            battletag: battletag.toLowerCase(),
            displayName: battletag,
            raidTeam: raidTeam,
            role: role,
        });

        return this.collaboratorsRepository.findOneBy({
            battletag: battletag.toLowerCase(),
            raidTeam: {
                id: raidTeam.id,
            },
        });
    }

    async delete(user: User, raidTeamId: string, battletag: string): Promise<void> {
        const raidTeam: RaidTeam = await this.accessService.assertUserOwnsRaidTeam(
            user,
            raidTeamId,
        );

        await this.collaboratorsRepository.delete({
            raidTeam: raidTeam,
            battletag: battletag.toLowerCase(),
        });
    }
}
