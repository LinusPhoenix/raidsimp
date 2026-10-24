import { Column, Entity, PrimaryColumn } from "typeorm";

/**
 * Item level at which the displayed color changes. Edit the rows in the database to
 * adjust the colors for a new patch, no redeploy needed.
 */
@Entity()
export class IlvlThreshold {
    @PrimaryColumn({ type: "integer" })
    ilvl: number;

    @Column({ type: "varchar", length: 7 })
    color: string;

    @Column({ type: "varchar", length: 32, default: "" })
    rarity: string;

    // Only documents what the threshold stands for, it is not exposed through the API.
    @Column({ type: "varchar", length: 256, default: "" })
    description: string;
}
