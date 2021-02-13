import { Progress } from "components/common";
const Fuel = ({ value, max, minimal = false }) => {
    const orientation = minimal ? 'f-row' : 'f-col';
    return (
        <div className={`w-full flex ${orientation} f-ac f-jc p-5`}>
            {!minimal && (
                <div className="w-full flex f-row f-ac f-jsb">
                    <h3>Fuel</h3>
                    <h3 className="valueHeader">
                        Units: <span>{`${value.toFixed(2)}/${max}`}</span>
                    </h3>
                </div>
            )}
            {minimal && <h3 className="mr-5">Fuel</h3>}
            <Progress className="w-full" max={max} value={value} critical={20} />
        </div>
    );
};
export default Fuel;