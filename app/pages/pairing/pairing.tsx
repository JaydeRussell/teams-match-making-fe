"use client";

import Card from "./card";
import './pairing.css';



type PairingProps = {
    player: Player;
    opponents: Opponent[];
    selectOpponent: selectOpponent;
    undoPair: undoPair;
    className?: string;
};

type selectOpponent = (player: Player, opp: Opponent) => Player
type undoPair = (player: Player) => Player

export default function Pairing({ player, opponents, selectOpponent, undoPair, className }: PairingProps) {
    const showList = player.pair === undefined;
    console.log(player)

    return (
        <div key={player.id} className={"pairing " + className}>
            {/* Player card */}
            <section aria-label="Player" className="player">
                {player.avatarUrl ? (
                    <img src={player.avatarUrl} alt={`${player.name} avatar`} className="avatar" />
                ) : (
                    <div aria-hidden className="blank-avatar" />
                )}
                <div>
                    <strong>{player.name}</strong>
                    <div style={{ fontWeight: 600, color: "#666" }}>{player.faction}</div>
                    <div></div>
                </div>
            </section>

            {/* Opponent list OR selected matchup */}
            {showList ? (
                <section aria-label="Opponents">
                    {opponents.length === 0 ? (
                        <p style={{ color: "#666" }}>No opponents available.</p>
                    ) : (
                        <ul role="list" className="opponent-list ">
                            {opponents.map((opponent) => (
                                <li key={opponent.id}>
                                    <button
                                        type="button"
                                        className="opponent"
                                        onClick={() => selectOpponent(player, opponent)}
                                        aria-label={`Select opponent ${opponent.name}`}
                                    >
                                        {opponent.avatarUrl ? (
                                            <img src={opponent.avatarUrl} alt={`${opponent.name} avatar`} className="avatar" />
                                        ) : (
                                            <div aria-hidden className="blank-avatar" />
                                        )}
                                        <div>
                                            <div style={{ fontWeight: 600, color: "#666" }}>{opponent.faction}</div>
                                            <div style={{ fontWeight: 250, color: "#666" }}>{opponent.name}</div>
                                            {player.matrix?.get(opponent.faction) !== undefined && (
                                                <div style={{ color: "#666" }}>
                                                    matrix: {player.matrix?.get(opponent.faction)}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            ) : (
                <section aria-label="Selected Matchup" >
                    <div className="opponent" >
                        <button type="button" className="undo-button" onClick={() => undoPair(player)} >X</button>
                        <div>
                            <div style={{ fontWeight: 600, color: "#666" }}>{player.pair!.faction}</div>
                            <div style={{ fontWeight: 250, color: "#666" }}>{player.pair!.name}</div>
                            {player.matrix?.get(player.pair!.faction) !== undefined && (
                                <div style={{ color: "#666" }}>
                                    matrix: {player.matrix?.get(player.pair!.faction)}
                                </div>
                            )}
                        </div>

                    </div>
                </section>
            )}
        </div>
    );
}

