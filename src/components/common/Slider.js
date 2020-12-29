import "./styles/Slider.css";

const Slider = ({ min = 1, max = 10, step = 1, value = 1, onChange = () => { } }) => {
    return (
        <input
            className="slider"
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