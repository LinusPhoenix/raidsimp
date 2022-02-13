import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @ApiProperty()
    @PrimaryColumn({
        type: "text",
    })
    battletag: string;

    @ApiProperty({
        type: "integer",
    })
    @Column({
        unique: true,
    })
    id: number;

    @ApiProperty({ format: "date-time" })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ format: "date-time" })
    @UpdateDateColumn()
    updatedAt: Date;
}
