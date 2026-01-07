"use client";
import React from "react";

import Pairing from "./pages/pairing/pairing";

const playerMasterList: Player[] = [
  {
    id: 0,
    name: "Jayde",
    faction: "world eaters",
    matrix: new Map<string, number>([
      ["druhkari", 0],
      ["blood angels", 15],
      ["Imperial Guard", 8],
      ["death guard", 12],
      ["Chaos Knights", 15]
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
      ["Chaos Knights", 10]
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
      ["Chaos Knights", 9]
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
      ["Chaos Knights", 20]
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
      ["Chaos Knights", 10]
    ]),
  },
];
const opponentMasterList: Opponent[] = [
  { name: "Ben Neal", faction: "druhkari", id: 0 },
  { name: "John Holbrook", faction: "blood angels", id: 1 },
  { name: "Matt Evans", faction: "Imperial Guard", id: 2 },
  { name: "Philip Schwan", faction: "death guard", id: 3 },
  { name: "Ryan Mcguire", faction: "Chaos Knights", id: 4 },
];



export default function Home() {
  const [opponents, setOpponents] = React.useState<Opponent[]>(opponentMasterList);
  const [players, setPlayers] = React.useState<Player[]>(playerMasterList)

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
