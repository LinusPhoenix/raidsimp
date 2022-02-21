import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthConfig } from "src/commons/auth-config";

export type JwtPayload = { sub: string; id: number; battletag: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: (req: Request) => {
                let token = null;
                if (req && req.cookies) {
                    token = req.cookies[AuthConfig.TOKEN_COOKIE_NAME];
                }
                return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
            },
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: JwtPayload) {
        return payload;
    }
}
