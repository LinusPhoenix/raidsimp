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
