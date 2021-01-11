import { Button } from "components/common";

const Bodies = ({ system = {}, onFocus }) => {
    return (
        <div className="ui-section mt-10 p-5">
            <h3>Objects</h3>
            <div className="w-full flex f-col f-ac f-jc">
                <Button
                    className="f-1"
                    onClick={() => onFocus({ object: 'player' })}
                >
                    {`SHIP`}
                </Button>
                {system.stars.map((s, i) => (
                    <Button
                        key={`star_${i}`} className="f-1"
                        onClick={() => onFocus({ object: 'stars', index: i })}
                    >
                        {`Star ${i}`}
                    </Button>
                ))}
                {system.planets.map((p, i) => (
                    <Button
                        key={`planet_${i}`} className="f-1"
                        onClick={() => onFocus({ object: 'planets', index: i })}
                    >
                        {`Planet ${i}`}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default Bodies;