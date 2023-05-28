import { ATTRIBUTION, RESOURCE_PATH, URL_TEMPLATE } from "@/constants";
import { useMount, useUpdateEffect } from "react-use";

import { getExampleByKey } from "@/utils";
import { html_beautify } from "js-beautify";
import { message } from "antd";
import translate from "@/locale/translate.json";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useStore } from "@/store";

export function useTitleArea() {
  const store = useStore();
  const location = useLocation();
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

  async function handleEdit() {
    const paths = location.pathname.split("/");

    const htmlRes = await fetch(
      `/codes/${paths[3]}/${paths[4]}/${paths[5]}/index.html`
    );
    const htmlCode = await htmlRes.text();
    const htmlData = `<link rel='stylesheet' href='https://maptalks.com/api/maptalks.css' />
    <script type='text/javascript' src='https://maptalks.com/api/maptalks.min.js'></script>
    <script type='text/javascript' src='https://maptalks.com/api/maptalks-gl-layers.js'></script>
    ${htmlCode}`;
    const cssRes = await fetch(
      `/codes/${paths[3]}/${paths[4]}/${paths[5]}/index.css`
    );
    const cssCode = await cssRes.text();
    const cssData = cssCode.replaceAll("{res}", RESOURCE_PATH);
    const jsRes = await fetch(
      `/codes/${paths[3]}/${paths[4]}/${paths[5]}/index.js`
    );
    const jsCode = await jsRes.text();
    const jsData = jsCode
      .replaceAll("{urlTemplate}", URL_TEMPLATE)
      .replaceAll("{attribution}", ATTRIBUTION)
      .replaceAll("{res}", RESOURCE_PATH);

    const example = getExampleByKey(`${paths[3]}_${paths[4]}_${paths[5]}`);
    const title = example.title[paths[2] as Language];
    const data = {
      title,
      description: title,
      html: html_beautify(htmlData),
      js: jsData,
      css: cssData,
    };
    const dataNode = document.getElementById("editor-data") as HTMLInputElement;
    dataNode.value = JSON.stringify(data);
    (document.getElementById("editor") as HTMLFormElement).submit();
  }

  const paths = store.selectedKey.split("_");

  return {
    title,
    paths,
    translate,
    language: store.language!,
    code: store.code,
    handleCopy,
    handleEdit,
  };
}
