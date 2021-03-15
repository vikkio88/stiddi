import { useStoreon } from "storeon/react";
import { Navbar } from "components/common";
import { SectorMap, SystemMap, GalaxyMap } from "components/maps";
import { MAPS } from "enums/ui";


const MAPS_MAP = {
    [MAPS.SECTOR_MAP]: SectorMap,
    [MAPS.SYSTEM_MAP]: SystemMap,
    [MAPS.GALAXY_MAP]: GalaxyMap,
};

const MAPS_LABELS = {
    [MAPS.SECTOR_MAP]: 'Sector',
    [MAPS.SYSTEM_MAP]: 'System',
    [MAPS.GALAXY_MAP]: 'Galaxy',
};

const Maps = () => {
    const { dispatch, maps: { system, currentMap } } = useStoreon('maps');

    const MapControls = MAPS_MAP[currentMap];
    const mapProps = { dispatch, system };

    return (
        <>
            <h1>
                Maps
            </h1>
            <Navbar
                current={currentMap}
                tabs={Object.values(MAPS)}
                onChange={tab => dispatch('maps:mapTabChange', { tab })}
                labels={MAPS_LABELS}
            />

            <MapControls
                {...mapProps}
            />
        </>
    );
};

export default Maps;