import { Hyperdrive } from "components/systems";
import { ENGINE_TYPES } from "enums/navigation";
import { useStoreon } from "storeon/react";

const Systems = () => {
    const { navigation } = useStoreon('navigation');
    const { settings } = navigation;

    return (
        <>
            <h1>
                Systems
            </h1>
            <Hyperdrive settings={settings[ENGINE_TYPES.HYPER_DRIVE]} />
        </>
    );
};

export default Systems;