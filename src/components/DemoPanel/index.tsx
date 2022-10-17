import { Container, Content } from "./style";

import CodeView from "./CodeView";
import MapView from "./MapView";
import TitleArea from "./TitleArea";

function DemoPanel() {
  return (
    <Container>
      <TitleArea />
      <Content>
        <MapView />
        <CodeView />
      </Content>
    </Container>
  );
}

export default DemoPanel;
