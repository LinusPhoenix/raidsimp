export class CharacterSummary {
    constructor(
        public _class: string,
        public spec: string,
        public averageItemLevel: number,
        public covenant?: string,
        public renown?: number,
    ) {}
}
