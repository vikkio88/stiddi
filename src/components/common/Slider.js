import "./styles/Slider.css";

const Slider = ({ min = 1, max = 10, step = 1, value = 1, onChange = () => { }, style = {}, className = '', disabled = false }) => {
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
            disabled={disabled}
        />
    );
};

export default Slider;