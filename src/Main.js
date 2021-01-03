import { useStoreon } from "storeon/react";
import { Navbar, Navigation, Maps } from "components/tabs";

import { TABS } from "enums/ui";

const TABS_MAPPING = {
  [TABS.NAVIGATION]: <Navigation />,
  [TABS.MAPS]: <Maps />
};

function Main() {
  const { ui: { tab } } = useStoreon("ui");
  return (
    <div className="flex f-col p-5 w-full">
      <Navbar onChange={tab => console.log(`switching to ${tab}`)} />
      {TABS_MAPPING[tab]}
    </div>
  );
}

export default Main;
