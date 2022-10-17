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

import examples from "../../../config/examples.json";
import { observer } from "mobx-react-lite";
import translate from "../../locale/translate.json";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";

function SiderMenu() {
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
      <MenuArea>
        <ActionBar>
          <SearchBar>
            <SearchInput type="text" />
            <SearchButton />
          </SearchBar>
          <DownloadButton href="https://github.com/maptalks/examples/archive/gh-pages.zip">
            {translate[store.language!]["download"]}
          </DownloadButton>
        </ActionBar>
        <Menu>
          {examples[index].examples.map((exampleI, i) => (
            <List key={exampleI.name}>
              <ListTile>
                {i + 1} {exampleI.title[store.language!]}
              </ListTile>
              <SecondList>
                {exampleI.examples.map((exampleJ, j) => (
                  <SecondListTitle
                    active={
                      store.selectedKey ===
                      `${examples[index].name}_${exampleI.name}_${exampleJ.name}`
                    }
                    key={exampleJ.name}
                    onClick={() =>
                      handleSelect(
                        examples[index].name,
                        exampleI.name,
                        exampleJ.name
                      )
                    }
                  >
                    {i + 1}.{j + 1} {exampleJ.title[store.language!]}
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
