import { ChangeEvent } from "react";
import examples from "../../../config/examples.json";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store";

export function useSiderMenu() {
  const store = useStore();
  const navigate = useNavigate();

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    store.setFilter(e.target.value);
  }

  function handleSelect(i: string, j: string, k: string, url?:string) {
    if (url) {
      window.open(url)
    } else {
      store.setTab("")
      store.setSelectedKey(`${i}_${j}_${k}`);
      navigate(`/examples/${store.language}/${i}/${j}/${k}`);
    }
  }

  function getTabIndex() {
    const index = examples.findIndex((example) => example.name === store.tab);
    if (index > -1) {
      return index;
    }
    return 0;
  }

  const tabIndex = getTabIndex();

  return {
    examples,
    tabIndex,
    language: store.language!,
    filter: store.filter,
    openKeys: store.openKeys,
    selectedKey: store.selectedKey,
    handleInputChange,
    handleSelect,
  };
}
