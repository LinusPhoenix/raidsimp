import { DataSource } from "typeorm";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";

const AppDataSource = new DataSource({
    name: "default",
    type: "sqlite",
    database: "./sqlite/raid_manager.db",
    entities: ["dist/**/*.entity{ .ts,.js}"],
    synchronize: false,
    migrations: ["dist/migrations/*{.ts,.js}"],
    migrationsTableName: "migrations_typeorm",
    migrationsRun: true,
});

export default AppDataSource;
