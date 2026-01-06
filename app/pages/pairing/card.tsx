
import './pairing.css';
import './card.css';



export default function Card({ title, person, }: {
    title: string;
    person: Player | Opponent;
}) {
    return (
        <div aria-label={title} className='card'>
            {person.avatarUrl ? (
                <img className='avatar' src={person.avatarUrl} alt={`${person.name} avatar`} />
            ) : (
                <div className='blank-avatar' aria-hidden />
            )}
            <div>
                <div style={{ fontWeight: 700 }}>{person.name}</div>
                {typeof person.matchup === "number" && (
                    <div style={{ color: "#666" }}>matchup: {person.matchup}</div>
                )}
            </div>
        </div>
    );
}
