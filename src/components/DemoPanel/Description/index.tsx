import { Container } from "./style";
import ReactMarkdown from "react-markdown";
import { observer } from "mobx-react-lite";
import remarkGfm from "remark-gfm";
import { useStore } from "@/store";

function Description() {
  const store = useStore();

  return !!store.description ? (
    <Container>
      <ReactMarkdown className="markdown-body" remarkPlugins={[[remarkGfm]]}>
        {store.description}
      </ReactMarkdown>
    </Container>
  ) : null;
}

export default observer(Description);
