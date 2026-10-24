import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IlvlThreshold } from "src/entities/ilvl-threshold.entity";
import { IlvlThresholdsController } from "./ilvl-thresholds.controller";
import { IlvlThresholdsService } from "./ilvl-thresholds.service";

@Module({
    imports: [TypeOrmModule.forFeature([IlvlThreshold])],
    providers: [IlvlThresholdsService],
    controllers: [IlvlThresholdsController],
})
export class IlvlThresholdsModule {}
