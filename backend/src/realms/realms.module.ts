import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { RealmsController } from "./realms.controller";
import { RealmsService } from "./realms.service";

@Module({
    imports: [ScheduleModule.forRoot()],
    providers: [RealmsService],
    controllers: [RealmsController],
})
export class RealmsModule {}
