import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RaidTeamsModule } from "./raid-teams/raid-teams.module";
import { RaidersModule } from "./raiders/raiders.module";
import { RealmsModule } from "./realms/realms.module";
import { SearchModule } from "./search/search.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { APP_GUARD } from "@nestjs/core";
import { GlobalAuthGuard } from "./auth/global.guard";

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
    providers: [
        {
            provide: APP_GUARD,
            useClass: GlobalAuthGuard,
        },
    ],
})
export class AppModule {}
