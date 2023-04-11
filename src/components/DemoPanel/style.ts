import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  margin: 10px 0 20px 0;
  padding-right: 8px;
  color: #333;
  overflow: hidden;
`;

const Content = styled.div`
  flex: 1;
  height: 100%;
  margin-top: 8px;
  padding-top: 12px;
  padding-bottom: 16px;
  border-top: 1px solid #ccc;
  box-sizing: border-box;
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

export { Container, Content };
