import { Container, View } from "./style";

import { observer } from "mobx-react-lite";
import { useMapView } from "./hooks";

function MapView() {
  const { code } = useMapView();

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

export default observer(MapView);
