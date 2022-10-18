import { Container, View } from "./style";

import { useRawPage } from "./hooks";

function RawPage() {
  const { code } = useRawPage();

  console.log(code);

  return (
    <Container>
      <View
        frameBorder={0}
        marginWidth={0}
        marginHeight={0}
        sandbox="allow-modals allow-popups allow-scripts allow-forms allow-same-origin"
        srcDoc={code}
        scrolling="no"
      />
    </Container>
  );
}

export default RawPage;
