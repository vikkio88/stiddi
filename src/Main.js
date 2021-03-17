import { useStoreon } from "storeon/react";
import ACTIONS from "store/actions";
import { Navigation, Maps, Systems, Comms } from "components/tabs";
import { Navbar } from "components/common";


import { TABS } from "enums/ui";

const TABS_MAPPING = {
  [TABS.NAVIGATION]: <Navigation />,
  [TABS.MAPS]: <Maps />,
  [TABS.SYSTEMS]: <Systems />,
  [TABS.COMMS]: <Comms />,
};

function Main() {
  const { dispatch, ui: { tab } } = useStoreon("ui");
  return (
    <div className="flex f-col p-5 w-full">
      <Navbar
        tabs={Object.values(TABS)}
        current={tab}
        onChange={tab => dispatch(ACTIONS.UI.TAB_CHANGE, { tab })}
      />
      {TABS_MAPPING[tab]}
    </div>
  );
}

export default Main;
