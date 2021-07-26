import { ApiProperty } from "@nestjs/swagger";
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

@Entity()
@Unique(["characterName", "realm", "raidTeam"])
export class Raider {
    @ApiProperty({ maxLength: 32, format: "uuid" })
    @PrimaryColumn({
        type: "uuid",
        length: 32,
    })
    id: string;

    @ApiProperty({ type: () => RaidTeam })
    @ManyToOne(() => RaidTeam, (raidTeam) => raidTeam.raiders)
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

    @ApiProperty({ format: "date-time" })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ format: "date-time" })
    @UpdateDateColumn()
    updatedAt: Date;
}
