import {
  ActionArea,
  ActionButton,
  ActionLink,
  ButtonIcon,
  Container,
  Title,
} from "./style";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useTitleArea } from "./hooks";

function TitleArea() {
  const { title, paths, translate, language, code, handleCopy } =
    useTitleArea();

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
            {translate[language]["source"]}
          </ActionButton>
        </ActionLink>
        <Link
          target="_blank"
          to={`/example/raw/${language}/${paths[0]}/${paths[1]}/${paths[2]}`}
        >
          <ActionButton>
            <ButtonIcon type="open" />
            {translate[language]["open"]}
          </ActionButton>
        </Link>
        <ActionLink>
          <ActionButton>
            <ButtonIcon type="edit" />
            {translate[language]["edit"]}
          </ActionButton>
        </ActionLink>
        <CopyToClipboard text={code} onCopy={handleCopy}>
          <ActionLink>
            <ActionButton>
              <ButtonIcon type="copy" />
              {translate[language]["copy"]}
            </ActionButton>
          </ActionLink>
        </CopyToClipboard>
      </ActionArea>
    </Container>
  );
}

export default observer(TitleArea);
