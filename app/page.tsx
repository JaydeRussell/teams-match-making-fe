"use client";
import React, { useEffect } from "react";

import Pairing from "./pages/pairing/pairing";


const opponentData = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSMvlwz1PYX4_LmYlhHF7MirXyL8zmjKVx92avc2fPLTPoZuzyIOoz_0B6TJc6wSTC9a5_ev5y12YQ0/pub?output=csv'


const playerMasterList: Player[] = [
  {
    id: 0,
    name: "Jayde",
    faction: "world eaters",
    matrix: new Map<string, number>([
      ["space marines", 0],
      ["blood angels", 15],
      ["imperial guard", 8],
      ["death guard", 12],
      ["chaos knights", 15]
    ]),
  },
  {
    id: 1,
    name: "Doug",
    faction: "black templars",
    matrix: new Map<string, number>([
      ["druhkari", 12],
      ["blood angels", 15],
      ["Imperial Guard", 12],
      ["death guard", 8],
      ["chaos knights", 10]
    ]),
  },
  {
    id: 2,
    name: "Jarrett",
    faction: "grey knights",
    matrix: new Map<string, number>([
      ["druhkari", 5],
      ["blood angels", 10],
      ["Imperial Guard", 15],
      ["death guard", 5],
      ["chaos knights", 9]
    ]),
  },
  {
    id: 3,
    name: "Herm",
    faction: "death guard",
    matrix: new Map<string, number>([
      ["druhkari", 12],
      ["blood angels", 5],
      ["Imperial Guard", 12],
      ["death guard", 15],
      ["chaos knights", 20]
    ]),
  },
  {
    id: 4,
    name: "David",
    faction: "imperial knights",
    matrix: new Map<string, number>([
      ["druhkari", 20],
      ["blood angels", 5],
      ["Imperial Guard", 12],
      ["death guard", 12],
      ["chaos knights", 10]
    ]),
  },
];

async function fetchOpponents(setOpponents: React.Dispatch<React.SetStateAction<Player[]>>) {
  try {
    const res = await fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSMvlwz1PYX4_LmYlhHF7MirXyL8zmjKVx92avc2fPLTPoZuzyIOoz_0B6TJc6wSTC9a5_ev5y12YQ0/pub?output=csv"
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const csv = await res.text();

    // Naive CSV parsing: split by lines, then commas.
    const lines = csv
      .trim()
      .split(/\r?\n/)
      .filter((l) => l.length > 0);

    // Assume headers: Name,Faction,Id (or no Id; we’ll generate one)
    const [header, ...rows] = lines;
    const headers = header.split(",").map((h) => h.trim().toLowerCase());

    const nameIdx = headers.indexOf("player");
    const factionIdx = headers.indexOf("faction");
    const idIdx = headers.indexOf("id"); // optional

    const data: Opponent[] = rows.map((line, index) => {
      const cols = line.split(",").map((c) => c.trim());
      return {
        name: cols[nameIdx] ?? "no name",
        faction: cols[factionIdx] ?? "",
        id:
          idIdx >= 0 && cols[idIdx] !== undefined
            ? Number(cols[idIdx])
            : index,
      };
    });

    setOpponents(data);
  } catch (err: any) {
    console.log(err.message ?? "Failed to load CSV");
  }
}

export default function Home() {
  const [opponents, setOpponents] = React.useState<Opponent[]>([]);
  const [players, setPlayers] = React.useState<Player[]>(playerMasterList)

  useEffect(() => {
    fetchOpponents(setOpponents);
  }, []);


  const selectOpponent = (player: Player, opp: Opponent) => {
    players[players.indexOf(player)].pair = opp
    setOpponents(opponents.filter((opps) => opps.id != opp.id));
    setPlayers(players)
    return opp;
  }

  const undoPair = (player: Player) => {
    opponents.push(player.pair!)
    players[players.indexOf(player)].pair = undefined
    setOpponents(opponents);
    setPlayers([...players])
    return player
  }

  var expectedScore: number = 0;


  players.forEach(player => {
    const opponent = player?.pair
    const expected = opponent ? player.matrix?.get(opponent.faction)! : 0;
    expectedScore = expectedScore + expected;
  })

  return (
    <div>
      <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        {
          players.map(player => {
            return (
              <Pairing key={player.id} player={player} opponents={opponents} selectOpponent={selectOpponent} undoPair={undoPair} className="bg-zinc-50 font-sans dark:bg-black" />
            );
          })
        }
      </div>
      <div className="flex items-center justify-center font-sans dark:bg-black">
        expectedScore: {expectedScore} out of {players.length * 20}
      </div>
    </div >
  );
}
