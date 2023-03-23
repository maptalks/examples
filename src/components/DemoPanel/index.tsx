import { Container, Content } from "./style";

import CodeView from "./CodeView";
import Description from "./Description";
import MapView from "./MapView";
import TitleArea from "./TitleArea";

function DemoPanel() {
  return (
    <Container>
      <TitleArea />
      <Content>
        <MapView />
        <Description />
        <CodeView />
      </Content>
    </Container>
  );
}

export default DemoPanel;
