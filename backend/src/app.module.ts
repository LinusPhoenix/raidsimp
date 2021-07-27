import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RaidTeamsModule } from "./raid-teams/raid-teams.module";
import { RaidersModule } from "./raiders/raiders.module";

@Module({
    imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(), RaidTeamsModule, RaidersModule],
})
export class AppModule {}
