import { Container, DemoViewer, HeaderWrapper } from "./style";
import { Header, SiderMenu } from "@/components";

import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <Container>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <DemoViewer>
        <SiderMenu />
        <Outlet />
      </DemoViewer>
    </Container>
  );
}

export default Layout;
