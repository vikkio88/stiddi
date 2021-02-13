import { useStoreon } from "storeon/react";
import { ENGINE_TYPES } from "enums/navigation";
import { Hyperdrive } from "components/systems";
import Fuel from "components/navigation/Fuel";

const Systems = () => {
    const { navigation, player: { fuel } } = useStoreon('navigation', 'player');
    const { settings } = navigation;

    return (
        <>
            <h1>
                Systems
            </h1>
            <Hyperdrive settings={settings[ENGINE_TYPES.HYPER_DRIVE]} />
            <div className="flex f-ac f-jc ui-section p-5 mt-5">
                <Fuel value={fuel.current} max={fuel.max} />
            </div>
        </>
    );
};

export default Systems;