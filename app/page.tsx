import Pairing from "./pages/pairing/pairing";

export default function Home() {

  const players: Player[] = [
    { name: "Jayde", faction: "world eaters", id: 0 },
    { name: "Doug", faction: "black templars", id: 1 },
    { name: "Jarrett", faction: "grey knights", id: 2 },
    { name: "Herm", faction: "death guard", id: 3 },
    { name: "David", faction: "imperial knights", id: 4 },
  ];
  const opponents: Player[] = [
    { name: "Ben Neal", faction: "druhkari", matchup: 8, id: 0 },
    { name: "John Holbrook", faction: "blood angels", matchup: 12, id: 1 },
    { name: "Matt Evans", faction: "Imperial Guard", matchup: 13, id: 2 },
    { name: "Philip Schwan", faction: "death guard", matchup: 0, id: 3 },
    { name: "Ryan Mcguire", faction: "Chaos Knights", matchup: 10, id: 4 },
  ];


  const expectedScore: number = -1;

  return (
    <div >
      <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        {
          players.map(player => {
            return (
              <Pairing key={player.id} player={player} opponents={opponents} className="bg-zinc-50 font-sans dark:bg-black" />
            );
          })
        }
      </div>
      <div className="flex items-center font-sans dark:bg-black">
        expectedScore: {expectedScore}
      </div>
    </div >
  );
}
