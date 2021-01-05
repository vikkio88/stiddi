import { useStoreon } from "storeon/react";
import { Navbar, Navigation, Maps } from "components/tabs";

import { TABS } from "enums/ui";

const TABS_MAPPING = {
  [TABS.NAVIGATION]: <Navigation />,
  [TABS.MAPS]: <Maps />
};

function Main() {
  const { dispatch, ui: { tab } } = useStoreon("ui");
  return (
    <div className="flex f-col p-5 w-full">
      <Navbar
        current={tab}
        onChange={tab => dispatch('ui:tabChange', { tab })}
      />
      {TABS_MAPPING[tab]}
    </div>
  );
}

export default Main;
