import { Injectable } from "@nestjs/common";

// TODO: This should be a real class/interface representing a user entity
export type User = {
    id: number;
    battletag: string;
};

@Injectable()
export class UsersService {
    private static readonly users = [];

    async findOrCreate(user: User): Promise<User> {
        console.log(`Finding or creating user with id ${user.id}.`);
        var existingUser = await UsersService.users.find((u) => u.id === user.id);
        if (!existingUser) {
            console.log(`No user with id ${user.id} exists, creating one.`);
            UsersService.users.push(user);
            console.log(`Created user with id ${user.id}.`);
            return user;
        }
        console.log(`Found existing user with id ${user.id}.`);
        return existingUser;
    }
}
