import { ApiProperty } from "@nestjs/swagger";
import { RaiderRole } from "src/commons/raider-roles";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
    Unique,
    UpdateDateColumn,
} from "typeorm";
import { RaidTeam } from "./raid-team.entity";

@Unique(["characterId", "raidTeam"])
@Entity()
export class Raider {
    @ApiProperty({ maxLength: 32, format: "uuid" })
    @PrimaryColumn({
        type: "uuid",
        length: 32,
    })
    id: string;

    @ManyToOne(() => RaidTeam, (raidTeam) => raidTeam.raiders, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        nullable: false,
    })
    raidTeam: RaidTeam;

    @ApiProperty()
    @Column()
    characterId: number;

    @ApiProperty({ maxLength: 16 })
    @Column({
        length: 16,
    })
    characterName: string;

    @ApiProperty({ maxLength: 128 })
    @Column({
        length: 128,
    })
    realm: string;

    @ApiProperty({ enum: RaiderRole })
    @Column({
        length: 8,
    })
    role: RaiderRole;

    @ApiProperty({ format: "date-time" })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ format: "date-time" })
    @UpdateDateColumn()
    updatedAt: Date;
}
