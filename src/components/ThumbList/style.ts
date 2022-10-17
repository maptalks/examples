import styled, { css } from "styled-components";

import { Col } from "antd";

const Container = styled.div`
  flex: 1;
  margin-top: 20px;
  padding-right: 10px;
  color: #333;
  overflow-x: hidden;
  overflow-y: auto;
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

const List = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.div`
  margin-bottom: 10px;
  line-height: 40px;
  border-bottom: 1px solid #ddd;
`;

const hideStyle = css`
  display: none;
`;

const StyledCol = styled(Col)<{ hide?: string }>`
  ${(props) => props.hide === "hide" && hideStyle}
`;

const Card = styled.div`
  background-color: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
`;

const Text = styled.span`
  display: flex;
  align-items: center;
  margin-left: 13px;
  line-height: 30px;
  font-size: 13px;
  white-space: nowrap;
`;

const Circle = styled.div`
  display: inline-block;
  width: 4px;
  height: 4px;
  margin-right: 8px;
  background-color: #000;
  border-radius: 50%;
`;

export { Container, List, Title, StyledCol, Card, Text, Circle };
