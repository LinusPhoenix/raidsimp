import { Controller, UseGuards, Request, Response, Get } from "@nestjs/common";
import { BNetOauth2Guard } from "./bnet.oauth2.guard";

@Controller("oauth/bnet")
export class BNetOauth2Controller {
    @UseGuards(BNetOauth2Guard)
    @Get()
    async bnetLogin(): Promise<any> {
        // Guard redirects to callback
    }

    @UseGuards(BNetOauth2Guard)
    @Get("callback")
    async bnetCallback(@Request() req): Promise<any> {
        return req.user;
    }
}
