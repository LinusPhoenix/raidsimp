import { Entity, PrimaryColumn } from "typeorm";

/**
 * Users with one of these battletags may use the admin panel. Manage the rows directly in the
 * database, e.g. `INSERT INTO admin(battletag) VALUES ('Name#1234');`.
 */
@Entity()
export class Admin {
    @PrimaryColumn({ type: "text" })
    battletag: string;
}
