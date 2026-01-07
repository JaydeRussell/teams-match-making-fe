type Player = {
    id: number;
    name: string;
    faction: string;
    matrix?: Map<string, number>;
    pair?: Opponent;
    matchup?: number;
    avatarUrl?: string;
};

type Opponent = Player;