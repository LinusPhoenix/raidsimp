import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/users.service";
import { JwtPayload } from "./jwt.strategy";

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    login(user: User): { accessToken: string } {
        console.log(`User ${user.battletag} has logged in. Issuing JWT with payload:`);
        const payload: JwtPayload = {
            sub: `${user.id}`,
            id: user.id,
            battletag: user.battletag,
        };
        console.log(JSON.stringify(payload, null, 4));
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
