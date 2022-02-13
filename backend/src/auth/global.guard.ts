import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt.guard";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
@Injectable()
export class GlobalAuthGuard extends JwtAuthGuard implements CanActivate {
    public constructor(private readonly reflector: Reflector) {
        super();
    }

    public canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.get<boolean>("isPublic", context.getHandler());

        if (isPublic) {
            return true;
        }

        return super.canActivate(context);
    }
}
