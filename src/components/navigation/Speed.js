import "./styles/Speed.css";

const Speed = ({ speed = 0 }) => {
    return (
        <div className="NavigationTab-speed">
            Speed: {speed}
        </div>
    );
};

export default Speed;