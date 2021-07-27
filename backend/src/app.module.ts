import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RaidTeamsModule } from "./raid-teams/raid-teams.module";
import { RaidersModule } from "./raiders/raiders.module";

@Module({
    imports: [TypeOrmModule.forRoot(), RaidTeamsModule, RaidersModule],
})
export class AppModule {}
