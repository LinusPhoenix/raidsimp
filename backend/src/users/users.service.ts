import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

    async findOrCreate(user: { id: number; battletag: string }): Promise<User> {
        this.logger.log(`Finding or creating user ${user.battletag}.`);
        const existingUser = await this.usersRepository.findOne(user.battletag);
        if (!existingUser) {
            this.logger.log(`User ${user.battletag} does not exist yet, creating one.`);
            const createdUser = this.usersRepository.create(user);
            this.logger.log(`Created user ${user.battletag}.`);
            return this.usersRepository.save(createdUser);
        }
        this.logger.log(`Found existing user ${user.battletag}.`);
        return existingUser;
    }

    async findOne(battletag: string): Promise<User> {
        return await this.usersRepository.findOneOrFail(battletag);
    }

    async remove(battletag: string): Promise<void> {
        await this.usersRepository.delete(battletag);
    }
}
