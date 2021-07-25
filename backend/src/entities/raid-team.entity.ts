import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Raider } from "./raider.entity";

@Entity()
export class RaidTeam {

    @PrimaryColumn("uuid")
    id: string;

    @Column({
        unique: true
    })
    name: string;

    @Column()
    region: string;

    @OneToMany(() => Raider, raider => raider.raidTeam, {
        cascade: true
    })
    raiders: Raider[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}