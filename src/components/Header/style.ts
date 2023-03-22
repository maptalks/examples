import styled, { css } from "styled-components";

import { gray } from "@/constants";
import { logoImg } from "./assets";

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  @media (min-width: 960px) and (min-width: 1921px) {
    width: 1600px;
  }
  @media (min-width: 960px) and (max-width: 1920px) and (min-width: 1601px) {
    width: 1400px;
  }
  @media (min-width: 960px) and (max-width: 1600px) and (min-width: 1000px) {
    width: 1000px;
  }
  @media (min-width: 960px) and (max-width: 768px) and (min-width: 420px) {
    width: auto;
  }
  @media (min-width: 960px) and (max-width: 420px) and (min-width: 376px) {
    width: auto;
  }
  @media (min-width: 960px) and (max-width: 375px) and (min-width: 300px) {
    width: auto;
  }
`;

const Area = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 48px;
  z-index: 10;
`;

const Logo = styled.a`
  display: block;
  width: 144px;
  height: 48px;
  background-image: url(${logoImg});
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 100% 100%;
  cursor: pointer;
`;

const LangSwitch = styled.a`
  display: block;
  height: 18px;
  line-height: 16px;
  margin: 2px 0 0 8px;
  padding: 0 4px;
  font-size: 10px;
  text-align: center;
  color: ${gray[12]};
  background-color: ${gray[2]};
  border: 1px solid ${gray[10]};
  border-radius: 4px;
  transition: all 0.2s;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    color: #48b1fc;
    border: 1px solid #48b1fc;
  }
`;

const activeStyle = css`
  background-color: #f1f1f1;
  border-color: #48b1fc;
`;

const Tab = styled.span<{ active?: boolean }>`
  display: inline-block;
  height: 100%;
  line-height: 48px;
  padding: 0 20px;
  font-size: 14px;
  color: #919eab;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  &:first-of-type {
    margin-left: 64px;
  }
  &:hover {
    color: #48b1fc;
  }
  ${(props) => props.active && activeStyle}
`;

export { Container, Area, Logo, LangSwitch, Tab };
