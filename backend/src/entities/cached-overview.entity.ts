import { join } from "path/posix";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Raider } from "./raider.entity";

@Entity()
export class CachedOverview {
    @OneToOne(() => Raider, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        primary: true,
    })
    @JoinColumn({ name: "raiderId" })
    raider: Raider;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    cachedOverview: string;
}
