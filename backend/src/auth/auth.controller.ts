import { Controller, Post, Res } from "@nestjs/common";
import { ApiFoundResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { ReqUser } from "src/commons/user.decorator";
import { User } from "src/entities/user.entity";
import { AuthModule } from "./auth.module";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    @ApiOperation({
        summary: "Logs the user out from the app by clearing the token cookie.",
    })
    @ApiFoundResponse({ description: "Logout successful." })
    @Post("logout")
    async logout(@ReqUser() user: User, @Res() res: Response): Promise<void> {
        console.log(`Logging out user ${user.battletag}.`);
        res.clearCookie(AuthModule.TOKEN_COOKIE_NAME, AuthModule.TOKEN_COOKIE_OPTIONS);
        console.log(`Logged out user ${user.battletag}.`);
        res.sendStatus(200);
    }
}