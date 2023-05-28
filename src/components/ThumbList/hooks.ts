import examples from "../../../config/examples";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store";

export function useThumbList() {
  const store = useStore();
  const navigate = useNavigate();

  function handleSelect(i: string, j: string, k: string) {
    if (store.openKey !== i) {
      store.setOpenKey(i);
    }
    const key = `${i}_${j}_${k}`;
    store.setSelectedKey(key);
    navigate(`/examples/${store.language}/${i}/${j}/${k}`);
    setTimeout(() => {
      const ele = document.querySelector(`[data-key=_${key}]`);
      ele?.scrollIntoView({
        behavior: "auto",
        block: "center"
      });
    });
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
    handleSelect
  };
}
