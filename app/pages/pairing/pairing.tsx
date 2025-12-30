
interface pairingProp {
    players: string[]
}

function Pairing({ players }: pairingProp) {
    return (
        <>
            Pairings: {players}
        </>
    )
}


export default Pairing;