import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryColumn({
        type: "text",
    })
    battletag: string;

    @Column({
        unique: true,
    })
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
