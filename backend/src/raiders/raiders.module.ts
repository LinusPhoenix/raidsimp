import { Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RaidTeam } from "src/entities/raid-team.entity";
import { Raider } from "src/entities/raider.entity";
import { RaidersController } from "./raiders.controller";
import { RaidersService } from "./raiders.service";

@Module({
    imports: [TypeOrmModule.forFeature([RaidTeam, Raider])],
    providers: [RaidersService],
    controllers: [RaidersController],
})
export class RaidersModule {}
