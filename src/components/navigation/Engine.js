import { Navbar } from "components/common";
import { ENGINE_TYPES } from "enums/navigation";

import { Hyperdrive, Thermal, Warp } from "./EngineControls";

import "./styles/Engine.css";

const ENGINE_CONTROLS_MAP = {
    [ENGINE_TYPES.THERMAL]: Thermal,
    [ENGINE_TYPES.HYPER_DRIVE]: Hyperdrive,
    [ENGINE_TYPES.WARP_DRIVE]: Warp,
};


const Engine = ({ speed = 0, lock = false, engineType, settings = {}, route = null, dispatch }) => {
    const EngineControl = ENGINE_CONTROLS_MAP[engineType];
    
    const disabledEngines = [ENGINE_TYPES.WARP_DRIVE];
    if (!route) disabledEngines.push(ENGINE_TYPES.HYPER_DRIVE);

    return (
        <div className="NavigationTab-engine">
            <Navbar
                className="w-full"
                current={engineType}
                tabs={Object.values(ENGINE_TYPES)}
                onChange={type => dispatch('navigation:engineTabChange', { type })}
                disabled={disabledEngines}
            />
            <EngineControl
                speed={speed}
                lock={lock}
                settings={settings}
                dispatch={dispatch}
                route={route}
            />
        </div>
    );
};


export default Engine;