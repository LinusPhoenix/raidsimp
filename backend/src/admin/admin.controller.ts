import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ReqUser } from "src/commons/user.decorator";
import { User } from "src/entities/user.entity";
import { AdminGuard } from "./admin.guard";
import { AdminService } from "./admin.service";
import { AdminConfigDto } from "./dto/admin-config.dto";

@ApiTags("admin")
@Controller("admin")
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @ApiOperation({ summary: "Whether the currently logged in user may use the admin panel." })
    @ApiOkResponse({ type: Boolean })
    @Get("is-admin")
    async isAdmin(@ReqUser() user: User): Promise<boolean> {
        return this.adminService.isAdmin(user.battletag);
    }

    @ApiOperation({ summary: "Get all configurable settings." })
    @ApiOkResponse({ type: AdminConfigDto })
    @ApiForbiddenResponse({ description: "The user is not an admin." })
    @UseGuards(AdminGuard)
    @Get("config")
    async getConfig(): Promise<AdminConfigDto> {
        return this.adminService.getConfig();
    }

    @ApiOperation({ summary: "Get the default values of all configurable settings." })
    @ApiOkResponse({ type: AdminConfigDto })
    @ApiForbiddenResponse({ description: "The user is not an admin." })
    @UseGuards(AdminGuard)
    @Get("config/defaults")
    getDefaultConfig(): AdminConfigDto {
        return this.adminService.getDefaultConfig();
    }

    @ApiOperation({ summary: "Replace all configurable settings." })
    @ApiOkResponse({ type: AdminConfigDto })
    @ApiForbiddenResponse({ description: "The user is not an admin." })
    @UseGuards(AdminGuard)
    @Put("config")
    async updateConfig(@Body() config: AdminConfigDto): Promise<AdminConfigDto> {
        return this.adminService.updateConfig(config);
    }
}
