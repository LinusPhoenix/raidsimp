import { Controller, UseGuards, Get, Req, Res } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { BNetOauth2Guard } from "./bnet-oauth2.guard";
import { JwtAuthGuard } from "./jwt.guard";

@Controller("oauth/bnet")
export class BNetOauth2Controller {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(BNetOauth2Guard)
    @Get()
    async bnetLogin(): Promise<any> {
        // Guard redirects to callback
    }

    @UseGuards(BNetOauth2Guard)
    @Get("callback")
    async bnetCallback(@Req() req, @Res() res: Response): Promise<void> {
        console.log("Logging in user that has authenticated with battlenet using Oauth2.");
        // TODO: Redirect instead of sending no response
        const authResponse = this.authService.login(req.user);
        // TODO: Don't hardcode cookie name
        res.cookie("accessToken", authResponse.accessToken, {
            sameSite: "strict",
            secure: true,
            httpOnly: true,
        });
        res.end();
    }

    // TODO: Remove this when global auth is in place.
    @UseGuards(JwtAuthGuard)
    @Get("protected")
    async protected(): Promise<string> {
        return "This endpoint is protected!";
    }
}
