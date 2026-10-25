import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AdminService } from "./admin.service";

/** Only lets users through whose battletag is listed in the admin table. */
@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly adminService: AdminService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!(await this.adminService.isAdmin(request.user?.battletag))) {
            throw new ForbiddenException();
        }
        return true;
    }
}
