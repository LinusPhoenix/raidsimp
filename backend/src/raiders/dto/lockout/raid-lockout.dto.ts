import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { isArray } from "class-validator";
import { RaidDifficultyLockout } from "./raid-difficulty-lockout.dto";

export class RaidLockout {
    @ApiProperty()
    name: string;

    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: RaidDifficultyLockout, isArray: true })
    lockouts: RaidDifficultyLockout[];
}
