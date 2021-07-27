import { ApiProperty } from "@nestjs/swagger";
import { RaidDifficulty } from "src/commons/raid-difficulties";

export class RaidDifficultyLockout {
    @ApiProperty({ enum: RaidDifficulty })
    difficulty: RaidDifficulty;

    @ApiProperty({ type: "integer", minimum: 0 })
    bossesKilled: number;

    @ApiProperty({ type: "integer", minimum: 0 })
    bossesTotal: number;
}
