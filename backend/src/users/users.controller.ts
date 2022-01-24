import { Controller, Delete, Get, Res } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { use } from "passport";
import { AuthModule } from "src/auth/auth.module";
import { ReqUser } from "src/commons/user.decorator";
import { User } from "src/entities/user.entity";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: "Returns information about the currently logged in user." })
    @ApiOkResponse()
    @Get("whoami")
    async getUserInfo(@ReqUser() user: User): Promise<User> {
        console.log(`User ${user.battletag} requested identity info.`);
        return await this.usersService.findOne(user.battletag);
    }

    @ApiOperation({
        summary:
            "Deletes the currently logged in user's account and all associated data (raid teams, etc).",
    })
    @ApiOkResponse()
    @Delete()
    async deleteUser(@ReqUser() user: User, @Res() res: Response): Promise<void> {
        console.log(`User ${user.battletag} requested account deletion.`);
        await this.usersService.remove(user.battletag);
        res.clearCookie(AuthModule.TOKEN_COOKIE_NAME, AuthModule.TOKEN_COOKIE_OPTIONS);
        console.log(`Deleted user ${user.battletag} and all associated data.`);
        res.sendStatus(200);
    }
}
