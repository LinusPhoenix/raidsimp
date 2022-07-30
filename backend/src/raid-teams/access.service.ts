import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RaidTeamNotFoundException } from "src/commons/exceptions/raid-team-not-found.exception";
import { CollaboratorRole, UserRole } from "src/commons/user-roles";
import { Collaborator } from "src/entities/collaborator.entity";
import { RaidTeam } from "src/entities/raid-team.entity";
import { User } from "src/entities/user.entity";
import { FindOptionsRelations, Repository } from "typeorm";

@Injectable()
export class AccessService {
    constructor(
        @InjectRepository(RaidTeam) private raidTeamsRepository: Repository<RaidTeam>,
        @InjectRepository(Collaborator) private collaboratorsRepository: Repository<Collaborator>,
    ) {}

    async getAllRaidTeamsForUser(user: User): Promise<RaidTeam[]> {
        const ownerRaidTeams: RaidTeam[] = await this.raidTeamsRepository.find({
            where: {
                owner: {
                    battletag: user.battletag,
                },
            },
            relations: {
                raiders: true,
                owner: true,
            },
        });
        ownerRaidTeams.forEach((raidTeam) => (raidTeam.userRole = UserRole.Owner));

        const collaborators: Collaborator[] = await this.collaboratorsRepository.find({
            where: {
                battletag: user.battletag.toLowerCase(),
            },
            relations: {
                raidTeam: {
                    raiders: true,
                    owner: true,
                },
            },
        });
        const collabRaidTeams: RaidTeam[] = collaborators.map((collaborator) => {
            const raidTeam = collaborator.raidTeam;
            raidTeam.userRole =
                collaborator.role === CollaboratorRole.Editor ? UserRole.Editor : UserRole.Viewer;
            return raidTeam;
        });

        return [...ownerRaidTeams, ...collabRaidTeams];
    }

    async assertUserOwnsRaidTeam(
        user: User,
        raidTeamId: string,
        relations?: FindOptionsRelations<RaidTeam>,
    ): Promise<RaidTeam> {
        const raidTeam: RaidTeam = await this.raidTeamsRepository.findOne({
            where: {
                id: raidTeamId,
            },
            relations: {
                ...relations,
                owner: true,
            },
        });
        if (!raidTeam || raidTeam.owner.battletag !== user.battletag) {
            const collaborator = await this.collaboratorsRepository.findOne({
                where: {
                    raidTeam: {
                        id: raidTeam.id,
                    },
                    battletag: user.battletag.toLowerCase(),
                },
            });
            if (collaborator) {
                throw new ForbiddenException("You must be the owner of the raid team.");
            } else {
                throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
            }
        }
        raidTeam.userRole = UserRole.Owner;
        return raidTeam;
    }

    async assertUserCanEditRaidTeam(
        user: User,
        raidTeamId: string,
        relations?: FindOptionsRelations<RaidTeam>,
    ): Promise<RaidTeam> {
        const raidTeam: RaidTeam = await this.raidTeamsRepository.findOne({
            where: {
                id: raidTeamId,
            },
            relations: {
                ...relations,
                owner: true,
            },
        });
        if (!raidTeam || raidTeam.owner.battletag !== user.battletag) {
            const collaborator = await this.collaboratorsRepository.findOne({
                where: {
                    raidTeam: {
                        id: raidTeam.id,
                    },
                    battletag: user.battletag.toLowerCase(),
                },
            });
            if (!collaborator) {
                throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
            } else if (collaborator.role !== CollaboratorRole.Editor) {
                throw new ForbiddenException("You must be able to edit the raid team.");
            }
            raidTeam.userRole =
                collaborator.role === CollaboratorRole.Editor ? UserRole.Editor : UserRole.Viewer;
        } else {
            raidTeam.userRole = UserRole.Owner;
        }
        return raidTeam;
    }

    async assertUserCanViewRaidTeam(
        user: User,
        raidTeamId: string,
        relations?: FindOptionsRelations<RaidTeam>,
    ): Promise<RaidTeam> {
        const raidTeam: RaidTeam = await this.raidTeamsRepository.findOne({
            where: {
                id: raidTeamId,
            },
            relations: {
                ...relations,
                owner: true,
            },
        });
        if (!raidTeam || raidTeam.owner.battletag !== user.battletag) {
            const collaborator = await this.collaboratorsRepository.findOne({
                where: {
                    raidTeam: {
                        id: raidTeam.id,
                    },
                    battletag: user.battletag.toLowerCase(),
                },
            });
            if (!collaborator) {
                throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
            }
            raidTeam.userRole =
                collaborator.role === CollaboratorRole.Editor ? UserRole.Editor : UserRole.Viewer;
        } else {
            raidTeam.userRole = UserRole.Owner;
        }
        return raidTeam;
    }
}
