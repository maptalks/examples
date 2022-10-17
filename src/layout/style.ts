import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  overflow: hidden;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 50px;
  background-color: #f7f7f7;
`;

const DemoViewer = styled.div`
  position: relative;
  display: flex;
  height: calc(100% - 50px);
  margin: 0 auto;
  overflow: hidden;
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

export { Container, HeaderWrapper, DemoViewer };
