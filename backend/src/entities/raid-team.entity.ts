import { BlizzardRegion } from "src/commons/regions";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Raider } from "./raider.entity";

@Entity()
export class RaidTeam {

    @PrimaryColumn({
        type: "uuid",
        length: 32
    })
    id: string;

    @Column({
        unique: true,
        length: 128
    })
    name: string;

    @Column({
        length: 8
    })
    region: BlizzardRegion;

    @OneToMany(() => Raider, raider => raider.raidTeam, {
        cascade: true
    })
    raiders: Raider[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}