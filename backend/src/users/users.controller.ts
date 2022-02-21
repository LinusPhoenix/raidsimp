import { Controller, Delete, Get, Logger, Res } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthConfig } from "src/commons/auth-config";
import { ReqUser } from "src/commons/user.decorator";
import { User } from "src/entities/user.entity";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
export class UsersController {
    private readonly logger = new Logger(UsersController.name);
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: "Returns information about the currently logged in user." })
    @ApiOkResponse({ type: User })
    @Get("whoami")
    async getUserInfo(@ReqUser() user: User): Promise<User> {
        return await this.usersService.findOne(user.battletag);
    }

    @ApiOperation({
        summary:
            "Deletes the currently logged in user's account and all associated data (raid teams, etc).",
    })
    @ApiOkResponse()
    @Delete()
    async deleteUser(@ReqUser() user: User, @Res() res: Response): Promise<void> {
        this.logger.log(`User ${user.battletag} requested account deletion.`);
        await this.usersService.remove(user.battletag);
        res.clearCookie(AuthConfig.TOKEN_COOKIE_NAME, AuthConfig.TOKEN_COOKIE_OPTIONS);
        this.logger.log(`Deleted user ${user.battletag} and all associated data.`);
        res.sendStatus(200);
    }
}
