import examples from "../../../config/examples.json";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store";

export function useThumbList() {
  const store = useStore();
  const navigate = useNavigate();

  function handleSelect(i: string, j: string, k: string) {
    store.setSelectedKey(`${i}_${j}_${k}`);
    navigate(`/example/${store.language}/${i}/${j}/${k}`);
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
    handleSelect,
  };
}
