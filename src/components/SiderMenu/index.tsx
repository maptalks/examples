import {
  ActionBar,
  Container,
  DownloadButton,
  List,
  ListTile,
  Menu,
  MenuArea,
  SearchBar,
  SearchButton,
  SearchInput,
  SecondList,
  SecondListTitle,
} from "./style";

import { observer } from "mobx-react-lite";
import translate from "../../locale/translate.json";
import { useSiderMenu } from "./hooks";

function SiderMenu() {
  const {
    examples,
    tabIndex,
    language,
    filter,
    selectedKey,
    handleInputChange,
    handleSelect,
  } = useSiderMenu();

  return (
    <Container>
      <MenuArea>
        <ActionBar>
          <SearchBar>
            <SearchInput
              type="text"
              value={filter}
              onChange={handleInputChange}
            />
            <SearchButton />
          </SearchBar>
          <DownloadButton href="https://github.com/maptalks/examples/archive/gh-pages.zip">
            {translate[language]["download"]}
          </DownloadButton>
        </ActionBar>
        <Menu>
          {examples[tabIndex].examples.map((exampleI, i) => (
            <List key={exampleI.name}>
              <ListTile>
                {i + 1} {exampleI.title[language]}
              </ListTile>
              <SecondList>
                {exampleI.examples.map((exampleJ, j) => (
                  <SecondListTitle
                    active={
                      selectedKey ===
                      `${examples[tabIndex].name}_${exampleI.name}_${exampleJ.name}`
                    }
                    hide={
                      !exampleJ.title[language].includes(filter)
                        ? "hide"
                        : "show"
                    }
                    key={exampleJ.name}
                    onClick={() =>
                      handleSelect(
                        examples[tabIndex].name,
                        exampleI.name,
                        exampleJ.name
                      )
                    }
                  >
                    {i + 1}.{j + 1} {exampleJ.title[language]}
                  </SecondListTitle>
                ))}
              </SecondList>
            </List>
          ))}
        </Menu>
      </MenuArea>
    </Container>
  );
}

export default observer(SiderMenu);
