import { useStoreon } from "storeon/react";
import { Navigation } from "components/tabs";

import { TABS } from "enums/ui";

const TABS_MAPPING = {
  [TABS.NAVIGATION]: <Navigation />
};

function Main() {
  const { ui: { tab } } = useStoreon("ui");
  return (
    <>
      {TABS_MAPPING[tab]}
    </>
  );
}

export default Main;
