import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RaidTeamNotFoundException } from "src/commons/exceptions/raid-team-not-found.exception";
import { CollaboratorRole } from "src/commons/user-roles";
import { Collaborator } from "src/entities/collaborator.entity";
import { RaidTeam } from "src/entities/raid-team.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class CollaboratorsService {
    constructor(
        @InjectRepository(Collaborator) private collaboratorsRepository: Repository<Collaborator>,
        @InjectRepository(RaidTeam) private raidTeamsRepository: Repository<RaidTeam>,
    ) {}

    // TODO: Return a Forbidden exception instead of NotFound if the user is a collaborator but not an owner of the raid team.
    async findByRaidTeam(user: User, raidTeamId: string): Promise<Collaborator[]> {
        // Check if user is owner of the raid team.
        const raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(raidTeamId, {
            where: {
                owner: user,
            },
        });
        if (!raidTeam) {
            throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
        }

        return this.collaboratorsRepository.find({
            where: {
                raidTeam: raidTeam,
            },
        });
    }

    async addOrUpdate(
        user: User,
        raidTeamId: string,
        battletag: string,
        role: CollaboratorRole,
    ): Promise<Collaborator> {
        // Check if user is owner of the raid team.
        const raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(raidTeamId, {
            where: {
                owner: user,
            },
        });
        if (!raidTeam) {
            throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
        }

        await this.collaboratorsRepository.save({
            battletag: battletag,
            raidTeam: raidTeam,
            role: role,
        });

        return this.collaboratorsRepository.findOne({
            battletag: battletag,
            raidTeam: raidTeam,
        });
    }

    async delete(user: User, raidTeamId: string, battletag: string): Promise<void> {
        // Check if user is owner of the raid team.
        const raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(raidTeamId, {
            where: {
                owner: user,
            },
        });
        if (!raidTeam) {
            throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
        }

        await this.collaboratorsRepository.delete({
            raidTeam: raidTeam,
            battletag: battletag,
        });
    }
}
