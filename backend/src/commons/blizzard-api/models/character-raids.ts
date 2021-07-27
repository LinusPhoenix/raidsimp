export interface CharacterRaids {
    character: {
        name: string;
        id: number;
        realm: {
            name: string;
            id: number;
            slug: string;
        };
    };
    expansions: [
        {
            expansion: {
                name: string;
                id: number;
            };
            instances: [
                {
                    instance: {
                        name: string;
                        id: number;
                    };
                    modes: [
                        {
                            difficulty: {
                                type: string;
                                name: string;
                            };
                            status: {
                                type: string;
                                name: string;
                            };
                            progress: {
                                completed_count: number;
                                total_count: number;
                                encounters: [
                                    {
                                        encounter: {
                                            name: string;
                                            id: number;
                                        };
                                        completed_count: number;
                                        last_kill_timestamp: number;
                                    },
                                ];
                            };
                        },
                    ];
                },
            ];
        },
    ];
}
