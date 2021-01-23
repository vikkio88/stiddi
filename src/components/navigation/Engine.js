import { Navbar } from "components/common";
import { ENGINE_TYPES } from "enums/navigation";

import { Hyperdrive, Thermal, Warp } from "./EngineControls";

import "./styles/Engine.css";

const ENGINE_CONTROLS_MAP = {
    [ENGINE_TYPES.THERMAL]: Thermal,
    [ENGINE_TYPES.HYPER_DRIVE]: Hyperdrive,
    [ENGINE_TYPES.WARP_DRIVE]: Warp,
};


const Engine = ({ speed = 0, lock = false, engineType, settings = {}, dispatch }) => {
    const EngineControl = ENGINE_CONTROLS_MAP[engineType];
    return (
        <div className="NavigationTab-engine">
            <Navbar
                className="w-full"
                current={engineType}
                tabs={Object.values(ENGINE_TYPES)}
                onChange={type => dispatch('navigation:subtabChange', { type })}
            />
            <EngineControl
                speed={speed}
                lock={lock}
                settings={settings}
                dispatch={dispatch}
            />
        </div>
    );
};


export default Engine;