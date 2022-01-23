import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

    async findOrCreate(user: { id: number; battletag: string }): Promise<User> {
        console.log(`Finding or creating user ${user.battletag}.`);
        const existingUser = await this.usersRepository.findOne(user.battletag);
        if (!existingUser) {
            console.log(`User ${user.battletag} does not exist yet, creating one.`);
            const createdUser = this.usersRepository.create(user);
            console.log(`Created user ${user.battletag}.`);
            return this.usersRepository.save(createdUser);
        }
        console.log(`Found existing user ${user.battletag}.`);
        return existingUser;
    }
}
