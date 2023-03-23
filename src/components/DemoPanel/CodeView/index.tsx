import { Snippet, Title } from "./style";

import { Container } from "../style";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { html_beautify } from "js-beautify";
import { observer } from "mobx-react-lite";
import prism from "react-syntax-highlighter/dist/esm/styles/prism/prism";
import { useStore } from "@/store";

function CodeView() {
  const store = useStore();

  return (
    <Container>
      <Snippet>
        <Title>index.html</Title>
        <SyntaxHighlighter
          language="html"
          style={prism}
          customStyle={{ margin: 0, background: "#f8f8f8" }}
        >
          {html_beautify(store.code, {
            indent_size: 2,
            indent_inner_html: true,
          })}
        </SyntaxHighlighter>
      </Snippet>
    </Container>
  );
}

export default observer(CodeView);
