import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class BNetOauth2Guard extends AuthGuard("bnet") {}
