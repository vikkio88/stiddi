import { createNanoEvents } from 'nanoevents';

const init = () => {
    window.eBridge = createNanoEvents();
};

export default init;