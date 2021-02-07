import { getUnixTime, intervalToDuration } from 'date-fns';


export const Time = {
    now() {
        const now = new Date();
        return getUnixTime(now);
    },
    remaining(start, duration) {
        const now = this.now();
        const passed = now - start;
        if (passed > duration) return 0;
        return duration - passed;
    },
    intervalDurationSecs(seconds) {
        return this.intervalDuration(seconds * 1000);
    },
    intervalDuration(milliseconds) {
        const duration = intervalToDuration({ start: 0, end: milliseconds });
        return `${duration.minutes}m ${duration.seconds}s`;
    }
};