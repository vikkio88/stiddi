import { Button } from "components/common";
import "./styles/Bodies.css";

const Row = ({ index, name, offset = 0, body, onFocus }) => {
    return (
        <div className="Bodies-Row w-full">
            <div className="f-1 ml-5">
                {`#${index + 1}`}
            </div>

            <div className="f-3 ml-5">
                {`${name}`}
            </div>

            <div className="f-1 flex f-jc f-ac">
                {`${offset} Ls`}
            </div>

            <div className="f-2 flex f-je f-ac">
                <Button onClick={() => onFocus({ object: body, index })}>
                    F
                </Button>
            </div>

        </div>
    );
};

const Bodies = ({ system = {}, onFocus }) => {
    //onFocus = a => console.log(a);
    return (
        <>
            <h3 style={{ alignSelf: "flex-start", marginTop: "5px" }}>Objects</h3>
            <Button
                className="mb-5"
                style={{ alignSelf: "flex-end", height: "100px" }}
                onClick={() => onFocus({ object: 'player' })}
            >
                Ship
            </Button>
            <div
                style={{ maxHeight: "500px", overflowY: "auto", overflowX: "hidden" }}
                className="flex ui-section mt-10 f-col f-ac f-jc p-5"
            >
                {system.stars.map((s, i) => (
                    <Row key={`star_${i}`} {...s} body="stars" onFocus={onFocus} />
                ))}
                {system.planets.map((p, i) => (
                    <Row key={`planet_${i}`} {...p} body="planets" onFocus={onFocus} />
                ))}
            </div>
        </>
    );
};

export default Bodies;