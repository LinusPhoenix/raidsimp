import { ApiProperty } from "@nestjs/swagger";
import { RegionName } from "blizzapi";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { Raider } from "./raider.entity";
import { User } from "./user.entity";

@Entity()
export class RaidTeam {
    @ApiProperty({ maxLength: 32, format: "uuid" })
    @PrimaryColumn({
        type: "uuid",
        length: 32,
    })
    id: string;

    @ManyToOne(() => User, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        nullable: false,
    })
    owner: User;

    @ApiProperty({ minLength: 3, maxLength: 128 })
    @Column({
        length: 128,
        unique: false,
    })
    name: string;

    @ApiProperty({ enum: RegionName })
    @Column({
        length: 8,
    })
    region: RegionName;

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
