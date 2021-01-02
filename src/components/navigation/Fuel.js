import { Progress } from "components/common";
const Fuel = ({ value, max }) => {
    return (
        <div className="w-full flex f-col f-ac f-jc p-5">
            <div className="w-full flex f-row f-ac f-jsb">
                <h3>Fuel</h3>
                <h3 className="valueHeader">
                    Units: <span>{`${value.toFixed(2)}/${max}`}</span>
                </h3>
            </div>
            <Progress className="w-full" max={max} value={value} critical={20} />
        </div>
    );
};
export default Fuel;