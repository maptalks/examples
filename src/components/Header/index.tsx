import { Area, Container, LangSwitch, Logo, Tab, Tabs } from "./style";
import { useLocation, useNavigate } from "react-router-dom";

import { observer } from "mobx-react-lite";
import { useMount } from "react-use";
import { useStore } from "@/store";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const store = useStore();

  useMount(() => {
    const paths = location.pathname.split("/");
    if (paths[3]) {
      store.setTab(paths[3]);
      if (paths[4] && paths[5]) {
        store.setSelectedKey(`${paths[3]}_${paths[4]}_${paths[5]}`);
      }
    }
  });

  function handleLanguageChange() {
    const { pathname } = location;
    if (store.language === "cn") {
      store.setLanguage("en");
      navigate(pathname.replace("/cn/", "/en/"));
    } else {
      store.setLanguage("cn");
      navigate(pathname.replace("/en/", "/cn/"));
    }
  }

  function handleTabChange(tab: string) {
    store.setTab(tab);
    store.setSelectedKey("");
    navigate(`/examples/${store.language}/${tab}`);
  }

  return (
    <Container>
      <Area>
        <Logo href="http://maptalks.org/" title="maptalks.org" />
        <LangSwitch onClick={handleLanguageChange}>
          {store.language === "cn" ? "EN" : "中文"}
        </LangSwitch>
      </Area>
      <Tabs>
        <Tab active>Examples</Tab>
        <Tab>API</Tab>
        <Tab>Docs</Tab>
        <Tab>Showcase</Tab>
        <Tab>Github</Tab>
      </Tabs>
    </Container>
  );
}

export default observer(Header);