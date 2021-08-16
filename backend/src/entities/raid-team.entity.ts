import { ApiProperty } from "@nestjs/swagger";
import { BlizzardRegion } from "src/commons/blizzard-regions";
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { Raider } from "./raider.entity";

@Entity()
export class RaidTeam {
    @ApiProperty({ maxLength: 32, format: "uuid" })
    @PrimaryColumn({
        type: "uuid",
        length: 32,
    })
    id: string;

    @ApiProperty({ minLength: 3, maxLength: 128 })
    @Column({
        unique: true,
        length: 128,
    })
    name: string;

    @ApiProperty({ enum: BlizzardRegion })
    @Column({
        length: 8,
    })
    region: BlizzardRegion;

    @ApiProperty({ type: () => [Raider] })
    @OneToMany(() => Raider, (raider) => raider.raidTeam)
    raiders: Raider[];

    @ApiProperty({ format: "date-time" })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ format: "date-time" })
    @UpdateDateColumn()
    updatedAt: Date;
}
