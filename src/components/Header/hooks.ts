import { useLocation, useNavigate } from "react-router-dom";

import { useMount } from "react-use";
import { useStore } from "@/store";

export function useHeader() {
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
    navigate(`/example/${store.language}/${tab}`);
  }

  return {
    language: store.language,
    tab: store.tab,
    handleLanguageChange,
    handleTabChange,
  };
}
