import { Injectable } from "@nestjs/common";

// TODO: This should be a real class/interface representing a user entity
export type User = {
    id: number;
    battletag: string;
};

@Injectable()
export class UsersService {
    // TODO: This should be saved in the database
    private static readonly users = [];

    async findOrCreate(user: User): Promise<User> {
        console.log(`Finding or creating user ${user.battletag}.`);
        const existingUser = await UsersService.users.find((u) => u.id === user.id);
        if (!existingUser) {
            console.log(`User ${user.battletag} does not exist yet, creating one.`);
            UsersService.users.push(user);
            console.log(`Created user ${user.battletag}.`);
            return user;
        }
        console.log(`Found existing user ${user.battletag}.`);
        return existingUser;
    }
}
