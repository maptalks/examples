import { Area, Container, LangSwitch, Logo, Tab } from "./style";

import examples from "../../../config/examples.json";
import { observer } from "mobx-react-lite";
import { useHeader } from "./hooks";

function Header() {
  const { language, tab, handleLanguageChange, handleTabChange } = useHeader();

  return (
    <Container>
      <Area>
        <Logo href="http://maptalks.org/" title="maptalks.org" />
        <LangSwitch onClick={handleLanguageChange}>
          {language === "cn" ? "EN" : "中文"}
        </LangSwitch>
      </Area>
      {examples.map((example) => (
        <Tab
          active={example.name === tab}
          key={example.name}
          onClick={() => handleTabChange(example.name)}
        >
          {example.title[language!]}
        </Tab>
      ))}
    </Container>
  );
}

export default observer(Header);
