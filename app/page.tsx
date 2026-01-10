"use client";
import React, { useEffect } from "react";

import Pairing from "./pages/pairing/pairing";


const opponentData = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRcdQNKgQOjIqnLimYvEurAKWn4c7GQOV12zIfChzWoB-YoRQZ6-iMZYWsptdmoUzbbEZ4dpvFH7t1s/pub?output=csv'
const playerData = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0fGIK5on2vqYIlv7EZf5DNAx1GtMHhG9QMc7QFp7jMgrojr-_N3INII8uBdVx-M19QveCWfN-NSeH/pub?output=csv'




const teams:Map<string, Player[]> = new Map<string, Player[]>;

async function fetchOpponents(setOpponents: React.Dispatch<React.SetStateAction<Player[]>>, opposingTeam: string) {
  try {
    const res = await fetch(opponentData);
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

    const teamIdx = headers.indexOf("team")
    const nameIdx = headers.indexOf("player");
    const factionIdx = headers.indexOf("faction");
    const idIdx = headers.indexOf("id"); // optional

    const data: Opponent[] = rows.map((line, index) => {
      const cols = line.split(",").map((c) => c.trim());

      return {
        team: cols[teamIdx] ?? "",
        name: cols[nameIdx] ?? "no name",
        faction: cols[factionIdx] ?? "",
        id:
          idIdx >= 0 && cols[idIdx] !== undefined
            ? Number(cols[idIdx])
            : index,
      };
    });

    data.forEach((opponent) => {
      if (teams.get(opponent.team) === undefined) {
        teams.set(opponent.team, [opponent]);
      } else {
        teams.get(opponent.team)!.push(opponent);
      }
    })

    const badGuys = teams.get(opposingTeam) === undefined ? teams.get(opposingTeam) : [];

    setOpponents(badGuys!);
  } catch (err: any) {
    console.log(err.message ?? "Failed to load CSV");
  }
}
async function fetchTeamMatrix(setPlayers: React.Dispatch<React.SetStateAction<Player[]>>) {
  try {
    const res = await fetch(playerData);
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

    const idIdx = headers.indexOf("id"); // optional
    const nameIdx = headers.indexOf("player");
    const factionIdx = headers.indexOf("faction");
    const factions: Map<string, number> = new Map<string, number>()
    headers.forEach((value, index)=>{
      if (value != "player" && value != "faction" && value != "") {
        factions.set(value, index)
      }
    });



     const data: Player[] = rows.map((line, index) => {
      const cols = line.split(",").map((c) => c.trim());
      const matrix: Map<string, number> = new Map<string, number>()
      factions.forEach((value, key)=>{
        matrix.set(key, Number(cols[value]));
      });
      return {
        name: cols[nameIdx] ?? "no name",
        faction: cols[factionIdx] ?? "",
        team:  "thundercluckers",
        matrix: matrix,
        id:
          idIdx >= 0 && cols[idIdx] !== undefined
            ? Number(cols[idIdx])
            : index,
      };
    });

    console.log(data)
    setPlayers(data!);
  } catch (err: any) {

  }
}

export default function Home() {
  const [opponents, setOpponents] = React.useState<Opponent[]>([]);
  const [players, setPlayers] = React.useState<Player[]>([])
  const [opposingTeam, setOpposingTeam] = React.useState<string>("")

  useEffect(() => {
    fetchOpponents(setOpponents, opposingTeam);
    fetchTeamMatrix(setPlayers);
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
      <div>
        Opponent: 
        <select onChange={(e) => {
          setOpposingTeam(e.target.value);
          setOpponents(teams.get(e.target.value)!);
          }}>
            {
              teams.keys().toArray().map((team)=> <option key={team} value={team}>{team}</option>)
            }
        </select>
      </div>
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
