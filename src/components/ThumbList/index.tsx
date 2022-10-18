import { Card, Circle, Container, List, StyledCol, Text, Title } from "./style";

import { Row } from "antd";
import { observer } from "mobx-react-lite";
import { useThumbList } from "./hooks";

function ThumbList() {
  const { examples, tabIndex, language, filter, handleSelect } = useThumbList();

  return (
    <Container>
      {examples[tabIndex].examples
        .filter((exampleI) => exampleI.name !== "plugin")
        .map((exampleI) => (
          <List key={exampleI.name}>
            <Title>{exampleI.title[language]}</Title>
            <Row gutter={[28, 24]}>
              {exampleI.examples
                .filter((exampleJ) => !exampleJ.url)
                .map((exampleJ) => (
                  <StyledCol
                    hide={
                      !exampleJ.title[language].includes(filter)
                        ? "hide"
                        : "show"
                    }
                    key={exampleJ.name}
                    span={6}
                  >
                    <Card
                      onClick={() =>
                        handleSelect(
                          examples[tabIndex].name,
                          exampleI.name,
                          exampleJ.name
                        )
                      }
                    >
                      <img
                        width="100%"
                        src={`/thumbnails/${examples[tabIndex].name}_${exampleI.name}_${exampleJ.name}.webp`}
                      />
                      <Text>
                        <Circle />
                        {exampleJ.title[language]}
                      </Text>
                    </Card>
                  </StyledCol>
                ))}
            </Row>
          </List>
        ))}
    </Container>
  );
}

export default observer(ThumbList);
