import { Area, Container, LangSwitch, Logo, Tab, Tabs } from "./style";
import { useLocation, useNavigate } from "react-router-dom";
import { useMount, useTimeoutFn, useUnmount } from "react-use";

import { observer } from "mobx-react-lite";
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
        store.setOpenKey(paths[3]);
        store.setSelectedKey(`${paths[3]}_${paths[4]}_${paths[5]}`);
      }
    }
  });

  useTimeoutFn(() => {
    const ele = document.querySelector(`[data-key=_${store.selectedKey}]`);
    ele?.scrollIntoView({
      behavior: "auto",
      block: "center"
    });
  });

  useUnmount(() => {
    store.setOpenKey("");
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

  return (
    <Container>
      <Area>
        <Logo href="http://maptalks.org/" title="maptalks.org" />
        <LangSwitch onClick={handleLanguageChange}>
          {store.language === "cn" ? "EN" : "中文"}
        </LangSwitch>
      </Area>
      <Tabs>
        <Tab $active>Examples</Tab>
        <Tab>API</Tab>
        <Tab>Docs</Tab>
        <Tab>Showcase</Tab>
        <Tab>Github</Tab>
      </Tabs>
    </Container>
  );
}

export default observer(Header);
