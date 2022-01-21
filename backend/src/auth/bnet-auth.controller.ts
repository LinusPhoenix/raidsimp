import { Controller, UseGuards, Get, Req, Res } from "@nestjs/common";
import { Response } from "express";
import { AuthModule } from "./auth.module";
import { AuthService } from "./auth.service";
import { BNetOauth2Guard } from "./bnet-oauth2.guard";
import { JwtAuthGuard } from "./jwt.guard";
import { Public } from "./public.decorator";

@Controller("oauth/bnet")
export class BNetOauth2Controller {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @UseGuards(BNetOauth2Guard)
    @Get()
    async bnetLogin(): Promise<any> {
        // Guard redirects to callback
    }

    @Public()
    @UseGuards(BNetOauth2Guard)
    @Get("callback")
    async bnetCallback(@Req() req, @Res() res: Response): Promise<void> {
        console.log("Logging in user that has authenticated with battlenet using Oauth2.");
        const authResponse = this.authService.login(req.user);
        res.cookie(AuthModule.TOKEN_COOKIE_NAME, authResponse.accessToken, {
            sameSite: "strict",
            secure: true,
            httpOnly: true,
        });
        res.redirect(process.env.REDIRECT_URL_AFTER_LOGIN);
    }

    // TODO: Remove this when global auth is in place.
    @UseGuards(JwtAuthGuard)
    @Get("protected")
    async protected(): Promise<string> {
        return "This endpoint is protected!";
    }
}
