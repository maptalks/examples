import { Snippet, Title } from "./style";
import { html_beautify, js_beautify } from "js-beautify";

import { Container } from "../style";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";

function CodeView() {
  const store = useStore();

  function getDisplayedCode() {
    const start = `/**start**/`;
    const end = `/**end**/`;
    const startIndex = store.code.indexOf(start);
    const endIndex = store.code.indexOf(end);
    if (startIndex > -1 && endIndex > -1) {
      const newCode = store.code.slice(startIndex + 11, endIndex);
      return newCode;
    }
    return store.code;
  }

  const displayedCode = getDisplayedCode();

  return (
    <Container>
      <Snippet>
        <Title>index.html</Title>
        <SyntaxHighlighter
          language={store.code === displayedCode ? "html" : "js"}
          customStyle={{ margin: 0, background: "#f8f8f8" }}
        >
          {store.code === displayedCode
            ? html_beautify(displayedCode, {
                indent_size: 2,
                indent_inner_html: true,
              })
            : js_beautify(displayedCode, {
                indent_size: 2,
              })}
        </SyntaxHighlighter>
      </Snippet>
    </Container>
  );
}

export default observer(CodeView);
