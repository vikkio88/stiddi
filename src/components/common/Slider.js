import "./styles/Slider.css";

const Slider = ({ min = 1, max = 10, step = 1, value = 1, onChange = () => { }, style = {}, className = '' }) => {
    return (
        <input
            style={style}
            className={`slider ${className}`}
            type="range"
            min={min}
            max={max}
            step={step}
            onChange={onChange}
            value={value}
        />
    );
};

export default Slider;