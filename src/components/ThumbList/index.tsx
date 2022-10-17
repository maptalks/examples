import { Card, Circle, Container, List, Text, Title } from "./style";
import { Col, Row } from "antd";

import examples from "../../../config/examples.json";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";

function ThumbList() {
  const store = useStore();
  const navigate = useNavigate();

  function handleSelect(i: string, j: string, k: string) {
    store.setSelectedKey(`${i}_${j}_${k}`);
    navigate(`/example/${store.language}/${i}/${j}/${k}`);
  }

  function getTabIndex() {
    const index = examples.findIndex((example) => example.name === store.tab);
    if (index > -1) {
      return index;
    }
    return 0;
  }

  const index = getTabIndex();

  return (
    <Container>
      {examples[index].examples.map((exampleI) => (
        <List key={exampleI.name}>
          <Title>{exampleI.title[store.language!]}</Title>
          <Row gutter={[28, 24]}>
            {exampleI.examples.map((exampleJ) => (
              <Col key={exampleJ.name} span={6}>
                <Card
                  onClick={() =>
                    handleSelect(
                      examples[index].name,
                      exampleI.name,
                      exampleJ.name
                    )
                  }
                >
                  <img
                    width="100%"
                    src={`/thumbnails/${examples[index].name}_${exampleI.name}_${exampleJ.name}.webp`}
                  />
                  <Text>
                    <Circle />
                    {exampleJ.title[store.language!]}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </List>
      ))}
    </Container>
  );
}

export default observer(ThumbList);
