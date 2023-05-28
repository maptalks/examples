import {
  ActionBar,
  Container,
  DownIcon,
  DownloadButton,
  LinkImg,
  ListBlock,
  ListTile,
  Menu,
  MenuArea,
  SearchBar,
  SearchButton,
  SearchInput,
  SecondList,
  SecondListTile,
  ThirdList,
  ThirdListTitle,
  UpIcon
} from "./style";

import { observer } from "mobx-react-lite";
import translate from "../../locale/translate.json";
import { urlImg } from "./assets";
import { useNavigate } from "react-router-dom";
import { useSiderMenu } from "./hooks";
import { useStore } from "@/store";

function SiderMenu() {
  const store = useStore();
  const navigate = useNavigate();
  const { examples, language, filter, openKey, selectedKey, handleInputChange, handleSelect } =
    useSiderMenu();

  function toggleOpen(key: string) {
    store.setTab(key);
    store.setSelectedKey("");
    store.setOpenKey(key);
    navigate(`/examples/${store.language}/${key}`);
  }

  return (
    <Container>
      <MenuArea>
        <ActionBar>
          <SearchBar>
            <SearchInput type="text" value={filter} onChange={handleInputChange} />
            <SearchButton />
          </SearchBar>
          <DownloadButton href="https://github.com/maptalks/examples/archive/gh-pages.zip">
            {translate[language]["download"]}
          </DownloadButton>
        </ActionBar>
        <Menu>
          {examples.map((exampleI) => (
            <div key={exampleI.name}>
              <ListTile $open={openKey === exampleI.name} onClick={() => toggleOpen(exampleI.name)}>
                <span>{exampleI.title[language]}</span>
                {openKey === exampleI.name ? <UpIcon /> : <DownIcon />}
              </ListTile>
              <ListBlock $hidden={openKey !== exampleI.name}>
                {exampleI.examples.map((exampleJ, j) => (
                  <SecondList key={exampleJ.name}>
                    <SecondListTile>
                      {j + 1} {exampleJ.title[language]}
                    </SecondListTile>
                    <ThirdList>
                      {exampleJ.examples.map((exampleK, k) => (
                        <ThirdListTitle
                          active={
                            selectedKey === `${exampleI.name}_${exampleJ.name}_${exampleK.name}`
                          }
                          data-key={`_${exampleI.name}_${exampleJ.name}_${exampleK.name}`}
                          hide={!exampleK.title[language].includes(filter) ? "hide" : "show"}
                          key={exampleK.name}
                          onClick={() =>
                            handleSelect(exampleI.name, exampleJ.name, exampleK.name, exampleK.url)
                          }
                        >
                          {j + 1}.{k + 1} {exampleK.title[language]}
                          {exampleK.url && <LinkImg title="external link" src={urlImg} />}
                        </ThirdListTitle>
                      ))}
                    </ThirdList>
                  </SecondList>
                ))}
              </ListBlock>
            </div>
          ))}
        </Menu>
      </MenuArea>
    </Container>
  );
}

export default observer(SiderMenu);
