import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IlvlThreshold } from "src/entities/ilvl-threshold.entity";
import { Repository } from "typeorm";
import { IlvlThresholdDto } from "./dto/ilvl-threshold.dto";

@Injectable()
export class IlvlThresholdsService {
    constructor(
        @InjectRepository(IlvlThreshold)
        private readonly repository: Repository<IlvlThreshold>,
    ) {}

    async findAll(): Promise<IlvlThresholdDto[]> {
        const thresholds = await this.repository.find({ order: { ilvl: "ASC" } });
        return thresholds.map(
            (threshold) =>
                new IlvlThresholdDto({
                    ilvl: threshold.ilvl,
                    color: threshold.color,
                    rarity: threshold.rarity,
                }),
        );
    }
}
