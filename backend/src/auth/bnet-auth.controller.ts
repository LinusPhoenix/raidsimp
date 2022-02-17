import { Controller, UseGuards, Get, Res, Logger } from "@nestjs/common";
import {
    ApiFoundResponse,
    ApiInternalServerErrorResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Response } from "express";
import { AuthConfig } from "src/commons/auth-config";
import { ReqUser } from "src/commons/user.decorator";
import { User } from "src/entities/user.entity";
import { AuthService } from "./auth.service";
import { BNetOauth2Guard } from "./bnet-oauth2.guard";
import { Public } from "./public.decorator";

@ApiTags("auth")
@Controller("oauth/bnet")
export class BNetOauth2Controller {
    private readonly logger = new Logger(BNetOauth2Controller.name);

    constructor(private readonly authService: AuthService) {}

    @ApiOperation({
        summary:
            "Login using battlenet Oauth2. Redirects to battlenet so the user can login there.\
             Do not call directly, use your browser.",
    })
    @ApiUnauthorizedResponse({ description: "Battlenet Oauth2 could not authenticate you." })
    @ApiInternalServerErrorResponse({
        description: "Battlenet Oauth2 encountered an unexpected error.",
    })
    @Public()
    @UseGuards(BNetOauth2Guard)
    @Get()
    async bnetLogin(): Promise<any> {
        // Guard redirects to callback
    }

    @ApiOperation({
        summary: "Callback for battlenet Oauth2. Do not call directly.",
        description:
            "Validates battlenet's access token,\
        creates and/or logs in the user in this app, then issues a JWT and returns it as a cookie.\
        Send this cookie with further requests to be authenticated.\
        Finally, redirects user to REDIRECT_URL_AFTER_LOGIN, which should be set to the frontend's main page.",
    })
    @ApiFoundResponse({ description: "Login successful, redirecting to frontend." })
    @Public()
    @UseGuards(BNetOauth2Guard)
    @Get("callback")
    async bnetCallback(@ReqUser() user: User, @Res() res: Response): Promise<void> {
        this.logger.log(`Battlenet oauth2 succeeded. Logging in user ${user.battletag}.`);
        const authResponse = this.authService.login(user);
        res.cookie(
            AuthConfig.TOKEN_COOKIE_NAME,
            authResponse.accessToken,
            AuthConfig.TOKEN_COOKIE_OPTIONS,
        );
        res.redirect(process.env.REDIRECT_URL_AFTER_LOGIN);
    }
}
