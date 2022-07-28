import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Raider } from "./raider.entity";

@Entity()
export class CachedOverview {
    @PrimaryColumn({
        type: "uuid",
        length: 32,
    })
    raiderId: string;

    @OneToOne(() => Raider, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "raiderId" })
    raider: Raider;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    cachedOverview: string;
}
