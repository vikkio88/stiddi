import { FUEL_MULTIPLIER } from "libs/game/navigation";
import "./styles/Calculations.css";

// this might need to be a setup config if you change ship
const ACCELERATION_MULTIPLIER = 5;


const Calculations = ({ burnTime = 0, throttle = 0 }) => {
    const dV = (ACCELERATION_MULTIPLIER * burnTime * throttle).toFixed(2);
    const fuel = (FUEL_MULTIPLIER * burnTime * throttle).toFixed(2);
    return (
        <div className="Calculations">
            <div className="w-full flex f-col f-ac mr-5">
                <h2>Selected Burn:</h2>
            </div>
            <div>
                <span className="label">δV: </span>
                <h3>
                    <span className="value">
                        ~{dV}
                    </span> m/s
                </h3>
            </div>

            <div>
                <span className="label">fuel: </span>
                <h3>
                    <span className="value">
                        ~{fuel}
                    </span> units
                </h3>
            </div>
        </div>
    );
};
export default Calculations;