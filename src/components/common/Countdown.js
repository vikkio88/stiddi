import { Time } from "libs/time";
import { useState, useEffect } from "react";

const Countdown = ({ start, duration }) => {
    const initialRemaining = Time.remaining(start, duration);
    const [remaining, setRemaining] = useState(initialRemaining);
    useEffect(() => {
        const timeout = setTimeout(() => {
            const newRemaining = Time.remaining(start, duration);
            setRemaining(newRemaining);
        }, 1000);
        return () => clearInterval(timeout);
    }, [remaining, start, duration]);
    const formatted = Time.intervalDurationSecs(remaining);
    return <>{formatted}</>;
};

export default Countdown;