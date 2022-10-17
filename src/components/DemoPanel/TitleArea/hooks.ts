import { useMount, useUpdateEffect } from "react-use";

import { getExampleByKey } from "@/utils";
import { message } from "antd";
import translate from "@/locale/translate.json";
import { useState } from "react";
import { useStore } from "@/store";

export function useTitleArea() {
  const store = useStore();
  const [title, setTitle] = useState("");

  useMount(() => {
    if (store.selectedKey) {
      const example = getExampleByKey(store.selectedKey);
      setTitle(example.title[store.language!]);
      document.title = `maptalks - ${example.title[store.language!]}`;
    } else {
      setTitle("");
      document.title = "maptalks - examples";
    }
  });

  useUpdateEffect(() => {
    if (store.selectedKey) {
      const example = getExampleByKey(store.selectedKey);
      setTitle(example.title[store.language!]);
      document.title = `maptalks - ${example.title[store.language!]}`;
    } else {
      setTitle("");
      document.title = "maptalks - examples";
    }
  }, [store.selectedKey, store.language]);

  function handleCopy() {
    message.success(translate[store.language!]["success"], 1);
  }

  const paths = store.selectedKey.split("_");

  return {
    title,
    paths,
    translate,
    language: store.language!,
    code: store.code,
    handleCopy,
  };
}
