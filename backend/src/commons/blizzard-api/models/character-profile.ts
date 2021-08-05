export interface CharacterProfile {
    id: number,
    name: string,
    character_class: {
        name: string,
        id: number
    }
}