export function home() {
    return "/";
}

export function raidTeams() {
    return "/raid-teams";
}

export function raidTeam(teamId: string) {
    return "/raid-teams/" + teamId;
}

export function raider(teamId: string, raiderId: string) {
    return "/raid-teams/" + teamId + "/raiders/" + raiderId;
}

export interface ArmoryUrlArgs {
    readonly region: string;
    readonly realm: string;
    readonly name: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function armoryUrl({ region, realm, name }: ArmoryUrlArgs) {
    return `https://worldofwarcraft.com/en-gb/character/${region}/${realm
        .replaceAll(" ", "-")
        .toLowerCase()}/${name}`;
}
