import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/entities/user.entity";
import { JwtPayload } from "./jwt.strategy";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(private readonly jwtService: JwtService) {}

    login(user: User): { accessToken: string } {
        const payload: JwtPayload = {
            sub: `${user.id}`,
            id: user.id,
            battletag: user.battletag,
        };
        this.logger.log(`User ${user.battletag} has logged in. Issuing JWT with payload: \n${JSON.stringify(payload, null, 4)}`);
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
