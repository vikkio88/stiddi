import "./styles/Progress.css";
import { RED, GREEN } from "enums/colours";

const Progress = ({ style = {}, value = 0, max = 100, critical = 40, className = '', height = '30px', showLabel = false }) => {
    style = {
        height,
        ...style
    };

    const size = value / max * 100;
    const barStyles = {
        backgroundColor: size < critical ? RED : GREEN,
        height: style.height,
        width: `${size}%`
    };
    return (
        <div className={`Progress ${className}`} style={style}>
            <div className="Progress-bar flex f-ac" style={barStyles}>
                {showLabel && `${size.toFixed(2)}%`}
            </div>
        </div>
    );
};
export default Progress;