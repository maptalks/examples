import { copyImg, editImg, openImg, sourceImg } from "./assets";
import styled, { css } from "styled-components";

import { blue } from "@/constants";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  line-height: 28px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const ActionArea = styled.div`
  display: flex;
`;

const ActionLink = styled.a`
  display: block;
  text-decoration: none;
`;

const ActionButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 28px;
  line-height: 24px;
  margin-left: 8px;
  padding: 0 6px 0 6px;
  font-size: 14px;
  color: ${blue[1]};
  background: #fcfcfc;
  border: 1px solid ${blue[1]};
  box-sizing: border-box;
  transition: all 0.3s;
  cursor: pointer;
`;

const sourceStyle = css`
  background-image: url(${sourceImg});
`;

const openStyle = css`
  background-image: url(${openImg});
`;

const editStyle = css`
  background-image: url(${editImg});
`;

const copyStyle = css`
  background-image: url(${copyImg});
`;
const ButtonIcon = styled.i<{ type: string }>`
  display: block;
  margin-right: 6px;
  width: 16px;
  height: 16px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100%;
  ${(props) => props.type === "source" && sourceStyle}
  ${(props) => props.type === "open" && openStyle}
  ${(props) => props.type === "edit" && editStyle}
  ${(props) => props.type === "copy" && copyStyle}
`;

export { Container, Title, ActionArea, ActionLink, ActionButton, ButtonIcon };
