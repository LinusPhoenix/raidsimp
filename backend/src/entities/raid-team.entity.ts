import { ApiProperty } from "@nestjs/swagger";
import { RegionName } from "blizzapi";
import { UserRole } from "src/commons/user-roles";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { Collaborator } from "./collaborator.entity";
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

    @ApiProperty({ type: () => User })
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

    @OneToMany(() => Collaborator, (collaborator) => collaborator.raidTeam)
    collaborators: Collaborator[];

    @ApiProperty({ enum: UserRole })
    userRole: UserRole;

    @ApiProperty({ format: "date-time" })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ format: "date-time" })
    @UpdateDateColumn()
    updatedAt: Date;
}
