
export default function Home() {

  const players = ["Jayde", "David", "Jarrett", "Herm", "Doug"]
  const opponents = ["Druhkari", "Guard", "Blood angels", "Choas Demons"]

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <table>
        {
          players.map(player => {
            return (
              <tr key={player}>
                <td>{player} | {opponents} </td>
              </tr>
            )
          })
        }
      </table>

    </div>
  );
}
