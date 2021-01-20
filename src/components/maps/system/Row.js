import { hashHex } from "libs/colours";
import { BODY_TYPES } from "enums/systemMap";
import { Button, Circle, Star } from "components/common";

const Row = ({ index, name, colour, offset = 0, body, showInfo, isSelected = false, isLocked = false }) => {
    const hashedCoulour = hashHex(colour);
    const isPlanet = body === BODY_TYPES.PLANET;
    return (
        <div className={`Bodies-Row${isSelected ? ' Bodies-Row-selected' : ''}`}>
            <div className="f-1 ml-5 flex f-jsa f-ac">
                {`#${index + 1 + (isPlanet ? 1 : 0)}`}
                {isPlanet ? <Circle radius={15} colour={hashedCoulour} /> : <Star size={30} colour={hashedCoulour} />}
            </div>

            <div className="f-3 ml-5">
                {`${name}`}
            </div>

            <div className="f-1 flex f-jc f-ac">
                {offset > 0 ? `${offset} Ls` : '-'}
            </div>

            <div className="f-2 flex f-je f-ac pr-5">
                <Button
                    style={{ height: "30px" }}
                    onClick={() => showInfo({ object: body, index })}
                    disabled={isLocked && !isSelected}
                >
                    Info
                </Button>
            </div>

        </div>
    );
};

export default Row;