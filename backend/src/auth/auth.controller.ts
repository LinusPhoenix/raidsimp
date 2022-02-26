import { Controller, Logger, Post, Res } from "@nestjs/common";
import { ApiFoundResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthConfig } from "src/commons/auth-config";
import { ReqUser } from "src/commons/user.decorator";
import { User } from "src/entities/user.entity";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    @ApiOperation({
        summary: "Logs the user out from the app by clearing the token cookie.",
    })
    @ApiFoundResponse({ description: "Logout successful." })
    @Post("logout")
    async logout(@ReqUser() user: User, @Res() res: Response): Promise<void> {
        this.logger.log(`Logging out user ${user.battletag}.`);
        res.clearCookie(AuthConfig.TOKEN_COOKIE_NAME, AuthConfig.TOKEN_COOKIE_OPTIONS);
        this.logger.log(`Logged out user ${user.battletag}.`);
        res.sendStatus(200);
    }
}
