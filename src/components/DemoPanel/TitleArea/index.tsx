import { ActionArea, ActionButton, ActionLink, ButtonIcon, Container, Title } from "./style";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
import { html_beautify } from "js-beautify";
import { observer } from "mobx-react-lite";
import { useTitleArea } from "./hooks";

function TitleArea() {
  const { title, paths, translate, language, code, handleCopy, handleEdit } = useTitleArea();

  function edit() {
    var htmlDataNode = document.getElementById("html-data") as any;
    var htmlData = htmlDataNode.innerText;
    var jsDataNode = document.getElementById("js-data") as any;
    var jsData = jsDataNode.innerText;
    var cssDataNode = document.getElementById("css-data") as any;
    var cssData = cssDataNode.innerText;
    var data = {
      title: "{{{ title }}}",
      description: "{{{ category }}} - {{{ title }}}"
    } as any;
    data.html = htmlData;
    data.js = jsData;
    data.css = cssData;
    var dataNode = document.getElementById("editor-data") as any;
    dataNode.value = JSON.stringify(data);
    (document.getElementById("editor") as any).submit();
  }

  return (
    <Container>
      <Title>{title}</Title>
      <ActionArea>
        <ActionLink
          href={`https://github.com/maptalks/examples/tree/develop/public/codes/${paths[0]}/${paths[1]}/${paths[2]}`}
          target="_blank"
        >
          <ActionButton>
            <ButtonIcon type="source" />
            {translate[language]["source"]}
          </ActionButton>
        </ActionLink>
        <Link
          style={{ textDecoration: "none" }}
          target="_blank"
          to={`/examples/raw/${language}/${paths[0]}/${paths[1]}/${paths[2]}`}
        >
          <ActionButton>
            <ButtonIcon type="open" />
            {translate[language]["open"]}
          </ActionButton>
        </Link>
        {/* <ActionLink onClick={handleEdit}>
          <ActionButton>
            <ButtonIcon type="edit" />
            {translate[language]["edit"]}
          </ActionButton>
        </ActionLink> */}
        <CopyToClipboard
          text={html_beautify(code, {
            indent_size: 2,
            indent_inner_html: true
          })}
          onCopy={handleCopy}
        >
          <ActionLink>
            <ActionButton>
              <ButtonIcon type="copy" />
              {translate[language]["copy"]}
            </ActionButton>
          </ActionLink>
        </CopyToClipboard>
      </ActionArea>
      <div style={{ display: "none" }}>
        <form method="post" action="https://codepen.io/pen/define" id="editor" target="_blanks">
          <input type="hidden" id="editor-data" name="data" value=""></input>
        </form>
      </div>
    </Container>
  );
}

export default observer(TitleArea);
