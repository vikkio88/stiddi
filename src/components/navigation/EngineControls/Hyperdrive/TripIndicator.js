import { Geom } from "libs/math";
import { Alignment } from "components/common";

const TripIndicator = ({ startingPosition, targetPos, distance }) => {
    const initialDistance = Geom.distancePoints(startingPosition, targetPos);
    return (
        <Alignment
            className="w-full"
            hideStatus
            max={100}
            value={((initialDistance - distance) / initialDistance) * 100}
        />
    );
};

export default TripIndicator;