import { Countdown } from "components/common";
import { ENGINE_TYPES } from "enums/navigation";
import { useStoreon } from "storeon/react";

const Systems = () => {
    const { navigation } = useStoreon('navigation');
    const { settings } = navigation;
    const { cooldown } = settings[ENGINE_TYPES.HYPER_DRIVE];

    return (
        <>
            <h1>
                Systems
            </h1>

            <div className="ui-section p-10">
                <h3>Hyperdrive</h3>
                <h5>Cooldown:</h5>
                {cooldown.startedAt && <Countdown start={cooldown.startedAt} duration={cooldown.duration / 1000} />}
            </div>

        </>
    );
};

export default Systems;