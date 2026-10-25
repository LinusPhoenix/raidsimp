import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Admin } from "src/entities/admin.entity";
import { IlvlThreshold } from "src/entities/ilvl-threshold.entity";
import { DEFAULT_ILVL_THRESHOLDS } from "src/ilvl-thresholds/default-ilvl-thresholds";
import { DataSource, Repository } from "typeorm";
import { AdminConfigDto, AdminIlvlThresholdDto } from "./dto/admin-config.dto";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin) private readonly admins: Repository<Admin>,
        @InjectRepository(IlvlThreshold) private readonly thresholds: Repository<IlvlThreshold>,
        private readonly dataSource: DataSource,
    ) {}

    async isAdmin(battletag: string | undefined): Promise<boolean> {
        return !!battletag && (await this.admins.countBy({ battletag })) > 0;
    }

    async getConfig(): Promise<AdminConfigDto> {
        const thresholds = await this.thresholds.find({ order: { ilvl: "ASC" } });
        return {
            ilvlThresholds: thresholds.map(
                ({ ilvl, color, rarity, description }): AdminIlvlThresholdDto => ({
                    ilvl,
                    color,
                    rarity,
                    description,
                }),
            ),
        };
    }

    getDefaultConfig(): AdminConfigDto {
        return { ilvlThresholds: DEFAULT_ILVL_THRESHOLDS.map((threshold) => ({ ...threshold })) };
    }

    async updateConfig(config: AdminConfigDto): Promise<AdminConfigDto> {
        const ilvls = config.ilvlThresholds.map((threshold) => threshold.ilvl);
        if (ilvls.length === 0) {
            throw new BadRequestException("At least one ilvl threshold is required.");
        }
        if (new Set(ilvls).size !== ilvls.length) {
            throw new BadRequestException("Ilvl thresholds must have distinct item levels.");
        }
        await this.dataSource.transaction(async (manager) => {
            await manager.clear(IlvlThreshold);
            await manager.save(
                IlvlThreshold,
                config.ilvlThresholds.map((threshold) => manager.create(IlvlThreshold, threshold)),
            );
        });
        return this.getConfig();
    }
}
