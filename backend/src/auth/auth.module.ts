import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { BNetOauth2Controller } from "./bnet.auth.controller";
import { BNetOauth2Strategy } from "./bnet.oauth2.strategy";

@Module({
    imports: [HttpModule, UsersModule],
    providers: [BNetOauth2Strategy],
    controllers: [BNetOauth2Controller],
})
export class AuthModule {}
