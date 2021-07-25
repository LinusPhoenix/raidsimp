import internal from "stream";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { RaidTeam } from "./raid-team.entity";

@Entity()
@Unique(["characterName", "realm", "raidTeam"])
export class Raider {

    @PrimaryColumn("uuid")
    id: string;

    @ManyToOne(() => RaidTeam, raidTeam => raidTeam.raiders)
    raidTeam: RaidTeam

    @Column()
    characterId: number;

    @Column()
    characterName: string;

    @Column()
    realm: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}