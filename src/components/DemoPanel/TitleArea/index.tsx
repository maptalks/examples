import {
  ActionArea,
  ActionButton,
  ActionLink,
  ButtonIcon,
  Container,
  Title,
} from "./style";
import { useMount, useUpdateEffect } from "react-use";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { getExampleByKey } from "@/utils";
import { message } from "antd";
import { observer } from "mobx-react-lite";
import translate from "@/locale/translate.json";
import { useState } from "react";
import { useStore } from "@/store";

function TitleArea() {
  const store = useStore();
  const [title, setTitle] = useState("");

  useMount(() => {
    if (store.selectedKey) {
      const example = getExampleByKey(store.selectedKey);
      setTitle(example.title[store.language!]);
    } else {
      setTitle("");
    }
  });

  useUpdateEffect(() => {
    if (store.selectedKey) {
      const example = getExampleByKey(store.selectedKey);
      setTitle(example.title[store.language!]);
    } else {
      setTitle("");
    }
  }, [store.selectedKey, store.language]);

  function handleCopy() {
    // @ts-ignore
    message.success(translate[store.language!]["success"], 1);
  }

  const paths = store.selectedKey.split("_");

  return (
    <Container>
      <Title>{title}</Title>
      <ActionArea>
        <ActionLink
          href={`https://github.com/maptalks/examples/tree/master/src/codes/${paths[0]}/${paths[1]}/${paths[2]}`}
          target="_blank"
        >
          <ActionButton>
            <ButtonIcon type="source" />
            {translate[store.language!]["source"]}
          </ActionButton>
        </ActionLink>
        <ActionLink>
          <ActionButton>
            <ButtonIcon type="open" />
            {translate[store.language!]["open"]}
          </ActionButton>
        </ActionLink>
        <ActionLink>
          <ActionButton>
            <ButtonIcon type="edit" />
            {translate[store.language!]["edit"]}
          </ActionButton>
        </ActionLink>
        <CopyToClipboard text={store.code} onCopy={handleCopy}>
          <ActionLink>
            <ActionButton>
              <ButtonIcon type="copy" />
              {translate[store.language!]["copy"]}
            </ActionButton>
          </ActionLink>
        </CopyToClipboard>
      </ActionArea>
    </Container>
  );
}

export default observer(TitleArea);
