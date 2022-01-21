import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RaidTeamsModule } from "./raid-teams/raid-teams.module";
import { RaidersModule } from "./raiders/raiders.module";
import { RealmsModule } from "./realms/realms.module";
import { SearchModule } from "./search/search.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(),
        RaidTeamsModule,
        RaidersModule,
        RealmsModule,
        SearchModule,
        AuthModule,
        UsersModule,
    ],
})
export class AppModule {}
