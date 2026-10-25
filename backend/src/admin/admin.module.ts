import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "src/entities/admin.entity";
import { IlvlThreshold } from "src/entities/ilvl-threshold.entity";
import { AdminController } from "./admin.controller";
import { AdminGuard } from "./admin.guard";
import { AdminService } from "./admin.service";

@Module({
    imports: [TypeOrmModule.forFeature([Admin, IlvlThreshold])],
    providers: [AdminService, AdminGuard],
    controllers: [AdminController],
})
export class AdminModule {}
