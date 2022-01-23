import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { CookieOptions } from "express";
import { UsersModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { BNetOauth2Controller } from "./bnet-auth.controller";
import { BNetOauth2Strategy } from "./bnet-oauth2.strategy";
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports: [
        HttpModule,
        // Using registerAsync here because register does not pick up values from process.env correctly.
        JwtModule.registerAsync({
            useFactory: async () => {
                return {
                    secret: process.env.JWT_SECRET,
                    signOptions: {
                        expiresIn: "1 day",
                    },
                };
            },
        }),
        UsersModule,
    ],
    providers: [BNetOauth2Strategy, JwtStrategy, AuthService],
    controllers: [BNetOauth2Controller],
})
export class AuthModule {
    public static readonly TOKEN_COOKIE_NAME: string = "accessToken";

    public static readonly TOKEN_COOKIE_OPTIONS: CookieOptions = {
        sameSite: "strict",
        secure: true,
        httpOnly: true,
    };
}
