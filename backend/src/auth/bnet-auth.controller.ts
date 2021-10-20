import { Controller, UseGuards, Get, Req } from "@nestjs/common";
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
    async bnetCallback(@Req() req): Promise<{ accessToken: string }> {
        console.log("Logging in user that has authenticated with battlenet using Oauth2.");
        // TODO: Set in cookie and redirect instead
        return this.authService.login(req.user);
    }

    // TODO: Remove this when global auth is in place.
    @UseGuards(JwtAuthGuard)
    @Get("protected")
    async protected(): Promise<string> {
        return "This endpoint is protected!";
    }
}
