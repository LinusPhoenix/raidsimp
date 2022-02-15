import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RaidTeamNotFoundException } from "src/commons/exceptions/raid-team-not-found.exception";
import { CollaboratorRole, UserRole } from "src/commons/user-roles";
import { Collaborator } from "src/entities/collaborator.entity";
import { RaidTeam } from "src/entities/raid-team.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AccessService {
    constructor(
        @InjectRepository(RaidTeam) private raidTeamsRepository: Repository<RaidTeam>,
        @InjectRepository(Collaborator) private collaboratorsRepository: Repository<Collaborator>,
    ) {}

    async assertUserOwnsRaidTeam(user: User, raidTeamId: string): Promise<RaidTeam> {
        const raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(raidTeamId, {
            relations: ["owner"],
        });
        if (!raidTeam || raidTeam.owner.battletag !== user.battletag) {
            const collaborator = await this.collaboratorsRepository.findOne({
                where: {
                    raidTeam: raidTeam,
                    battletag: user.battletag,
                },
            });
            if (collaborator) {
                throw new ForbiddenException("You must be the owner of the raid team.");
            } else {
                throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
            }
        }
        return raidTeam;
    }

    async assertUserCanEditRaidTeam(user: User, raidTeamId: string): Promise<RaidTeam> {
        const raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(raidTeamId, {
            relations: ["owner"],
        });
        if (!raidTeam || raidTeam.owner.battletag !== user.battletag) {
            const collaborator = await this.collaboratorsRepository.findOne({
                where: {
                    raidTeam: raidTeam,
                    battletag: user.battletag,
                },
            });
            if (collaborator.role !== CollaboratorRole.Editor) {
                throw new ForbiddenException("You must be able to edit the raid team.");
            } else {
                throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
            }
        }
        return raidTeam;
    }

    async assertUserCanViewRaidTeam(user: User, raidTeamId: string): Promise<RaidTeam> {
        const raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(raidTeamId, {
            relations: ["owner"],
        });
        if (!raidTeam || raidTeam.owner.battletag !== user.battletag) {
            const collaborator = await this.collaboratorsRepository.findOne({
                where: {
                    raidTeam: raidTeam,
                    battletag: user.battletag,
                },
            });
            if (!collaborator) {
                throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
            }
        }
        return raidTeam;
    }
}
