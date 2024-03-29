import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RaidTeam } from "src/entities/raid-team.entity";
import { Repository } from "typeorm";
import { CreateRaidTeamDto } from "./dto/create-raid-team.dto";
import { v4 as uuidv4 } from "uuid";
import { User } from "src/entities/user.entity";
import { AccessService } from "./access.service";
import { UserRole } from "src/commons/user-roles";
import { RaidTeamNameInvalidException } from "src/commons/exceptions/raid-team-name-invalid.exception";

@Injectable()
export class RaidTeamsService {
    constructor(
        @InjectRepository(RaidTeam) private raidTeamsRepository: Repository<RaidTeam>,
        private readonly accessService: AccessService,
    ) {}

    async create(user: User, raidTeam: CreateRaidTeamDto): Promise<RaidTeam> {
        if (raidTeam.name.trim().length === 0) {
            throw new RaidTeamNameInvalidException("The name of the raid team cannot be empty.");
        }
        let createdRaidTeam: RaidTeam = this.raidTeamsRepository.create({
            id: uuidv4(),
            owner: user,
            name: raidTeam.name.trim(),
            region: raidTeam.region,
            // This is necessary because by default these will be undefined, breaking the API contract.
            raiders: [],
            collaborators: [],
        });

        createdRaidTeam = await this.raidTeamsRepository.save(createdRaidTeam);
        createdRaidTeam.userRole = UserRole.Owner;

        return createdRaidTeam;
    }

    async findAll(user: User): Promise<RaidTeam[]> {
        return this.accessService.getAllRaidTeamsForUser(user);
    }

    async findOne(user: User, id: string): Promise<RaidTeam> {
        return await this.accessService.assertUserCanViewRaidTeam(user, id, { raiders: true });
    }

    async rename(user: User, id: string, newName: string): Promise<RaidTeam> {
        const raidTeam: RaidTeam = await this.accessService.assertUserOwnsRaidTeam(user, id);

        raidTeam.name = newName;

        await this.raidTeamsRepository.save(raidTeam);

        return this.findOne(user, id);
    }

    async remove(user: User, id: string): Promise<void> {
        const raidTeam: RaidTeam = await this.accessService.assertUserOwnsRaidTeam(user, id);

        await this.raidTeamsRepository.delete(raidTeam.id);
    }
}
