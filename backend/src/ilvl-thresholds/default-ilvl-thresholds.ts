import { AdminIlvlThresholdDto } from "src/admin/dto/admin-config.dto";

/** What the admin panel restores. Keep in sync with the initial values in the migration. */
export const DEFAULT_ILVL_THRESHOLDS: readonly AdminIlvlThresholdDto[] = [
    { ilvl: 0, color: "#9d9d9d", rarity: "Poor", description: "Always 0" },
    { ilvl: 243, color: "#1eff00", rarity: "Uncommon", description: "Highest LFR" },
    { ilvl: 256, color: "#0070dd", rarity: "Rare", description: "Highest Normal" },
    { ilvl: 269, color: "#a335ee", rarity: "Epic", description: "Highest Heroic" },
    { ilvl: 279, color: "#ff8000", rarity: "Legendary", description: "Average Mythic" },
    { ilvl: 289, color: "#e6cc80", rarity: "Artifact", description: "Highest Mythic" },
];
