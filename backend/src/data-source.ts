import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    name: "default",
    type: "sqlite",
    database: "./sqlite/raid_manager.db",
    entities: ["dist/**/*.entity{ .ts,.js}"],
    synchronize: false,
    migrations: ["dist/migrations/*{.ts,.js}"],
    migrationsTableName: "migrations_typeorm",
    migrationsRun: true,
});
