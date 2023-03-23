import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import styled, { css } from "styled-components";

import { gray } from "@/constants";
import { searchImg } from "./assets";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
  margin: 20px 20px 20px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  user-select: none;
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
  margin-bottom: 10px;
  padding-top: 8px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: none;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${gray[2]};
    border-radius: 3px;
  }
`;

const DownIcon = styled(CaretDownOutlined)`
  color: ${gray[5]};
`;

const UpIcon = styled(CaretUpOutlined)`
  color: ${gray[5]};
`;

const openStyle = css`
  color: ${gray[9]};
  ${DownIcon} {
    color: ${gray[7]};
  }
  ${UpIcon} {
    color: ${gray[7]};
  }
`;

const ListTile = styled.div<{ $open: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;
  padding: 0 18px;
  font-size: 14px;
  color: ${gray[7]};
  cursor: pointer;
  &:hover {
    color: ${gray[9]};
    background-color: ${gray[2]};
    ${DownIcon} {
      color: ${gray[7]};
    }
    ${UpIcon} {
      color: ${gray[7]};
    }
  }
  ${(props) => props.$open && openStyle}
`;

const hideStyle = css`
  display: none;
`;

const ListBlock = styled.div<{ $hidden: boolean }>`
  padding-left: 18px;
  ${(props) => props.$hidden && hideStyle}
`;

const SecondList = styled.li`
  list-style: none;
`;

const SecondListTile = styled.div`
  line-height: 20px;
  font-size: 12px;
  color: #aeaeae;
`;

const ThirdList = styled.ul`
  padding-left: 0;
  padding-bottom: 6px;
`;

const activeStyle = css`
  color: rgb(64, 169, 255);
  &:hover {
    color: rgb(64, 169, 255);
  }
`;

const ThirdListTitle = styled.a<{ active?: boolean; hide?: string }>`
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

const LinkImg = styled.img`
  margin-left: 3px;
  vertical-align: baseline;
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
  ListTile,
  DownIcon,
  UpIcon,
  ListBlock,
  SecondList,
  SecondListTile,
  ThirdList,
  ThirdListTitle,
  LinkImg,
};
