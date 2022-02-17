import { ApiProperty } from "@nestjs/swagger";
import { CollaboratorRole } from "src/commons/user-roles";
import { Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from "typeorm";
import { RaidTeam } from "./raid-team.entity";

@Entity()
export class Collaborator {
    @ApiProperty()
    @Column({
        primary: true,
        length: 32,
    })
    public battletag: string;

    @ApiProperty()
    @Column({
        length: 32,
    })
    public displayName: string;

    @ManyToOne(() => RaidTeam, (raidTeam) => raidTeam.id, {
        primary: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    public raidTeam: RaidTeam;

    @ApiProperty({ enum: CollaboratorRole })
    @Column({
        length: 32,
    })
    public role: CollaboratorRole;

    @ApiProperty({ format: "date-time" })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ format: "date-time" })
    @UpdateDateColumn()
    updatedAt: Date;
}
