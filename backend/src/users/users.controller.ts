import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
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
        return await this.usersService.findOne(user.battletag);
    }
}
