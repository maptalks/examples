import styled, { css } from "styled-components";

import { searchImg } from "./assets";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
  margin: 20px 20px 20px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
`;

const MenuArea = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 0;
  padding-top: 0;
  overflow: hidden;
`;

const ActionBar = styled.div`
  position: relative;
  display: flex;
  padding: 8px 8px 12px 8px;
  background: #fbfbfb;
  border-bottom: 1px solid #ddd;
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 28px;
  line-height: 18px;
  padding: 5px;
  font-size: 12px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 3px;
  &:focus {
    border: 1px solid #48b1fc;
    outline: none;
  }
`;

const SearchButton = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 24px;
  height: 24px;
  background: #fff;
  background-image: url(${searchImg});
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100%;
  cursor: pointer;
`;

const DownloadButton = styled.a`
  display: block;
  height: 28px;
  line-height: 26px;
  margin-left: 8px;
  padding: 0 6px;
  font-size: 12px;
  color: #555;
  text-decoration: none;
  border: 1px solid #ddd;
  border-radius: 3px;
  transition: all 0.2s;
  cursor: pointer;
  &:hover {
    color: #48b1fc;
    border-color: #48b1fc;
  }
`;

const Menu = styled.ul`
  flex: 1;
  margin: 0 6px 10px 10px;
  padding-top: 10px 0 0 0;
  overflow: auto;
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    opacity: 0;
    background: none;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #eee;
    border-radius: 3px;
  }
`;

const List = styled.li`
  list-style: none;
`;

const ListTile = styled.div`
  line-height: 20px;
  font-size: 12px;
  color: #aeaeae;
`;

const SecondList = styled.ul`
  padding-left: 0;
  padding-bottom: 6px;
`;

const activeStyle = css`
  color: rgb(64, 169, 255);
  &:hover {
    color: rgb(64, 169, 255);
  }
`;

const hideStyle = css`
  display: none;
`;

const SecondListTitle = styled.a<{ active?: boolean; hide?: string }>`
  display: block;
  line-height: 20px;
  padding-left: 12px;
  font-size: 12px;
  color: #666;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    color: #80caff;
  }
  ${(props) => props.active && activeStyle}
  ${(props) => props.hide === "hide" && hideStyle}
`;

export {
  Container,
  MenuArea,
  ActionBar,
  SearchBar,
  SearchInput,
  SearchButton,
  DownloadButton,
  Menu,
  List,
  ListTile,
  SecondList,
  SecondListTitle,
};
