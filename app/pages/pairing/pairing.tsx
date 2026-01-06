"use client";

import React from "react";
import Card from "./card";
import './pairing.css';



type PairingProps = {
    player: Player;
    opponents: Opponent[];
    className?: string;
};

export default function Pairing({ player, opponents, className }: PairingProps) {
    const [selectedOpponentId, setSelectedOpponentId] = React.useState<string | number | null>(null);
    const selectedOpponent = React.useMemo(() => opponents.find((o) => o.id === selectedOpponentId) ?? null, [selectedOpponentId, opponents]);

    const showList = selectedOpponent === null;

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
                    {typeof player.matchup === "number" && (
                        <div style={{ color: "#666" }}>matchup: {player.matchup}</div>
                    )}
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
                                        onClick={() => setSelectedOpponentId(opponent.id)}
                                        aria-label={`Select opponent ${opponent.name}`}
                                    >
                                        {opponent.avatarUrl ? (
                                            <img src={opponent.avatarUrl} alt={`${opponent.name} avatar`} className="avatar" />
                                        ) : (
                                            <div aria-hidden className="blank-avatar" />
                                        )}
                                        <div>
                                            <div style={{ fontWeight: 600, color: "#666" }}>{opponent.name}</div>
                                            {typeof opponent.matchup === "number" && (
                                                <div style={{ color: "#666" }}>
                                                    matrix: {opponent.matchup}
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
                    <div className="selected-matchup" >
                        <Card title="Opponent" person={selectedOpponent!} />
                        <button type="button" className="undo-button" onClick={() => setSelectedOpponentId(null)} >
                            undo pairing
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}

