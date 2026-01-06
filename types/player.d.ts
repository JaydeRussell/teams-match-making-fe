type Player = {
    id: string | number;
    name: string;
    faction: string;
    matchup?: number;
    avatarUrl?: string;
};

type Opponent = Player;