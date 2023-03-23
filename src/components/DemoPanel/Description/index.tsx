import { Container } from "./style";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";

function Description() {
  const store = useStore();

  return !!store.description ? (
    <Container>{store.description}</Container>
  ) : null;
}

export default observer(Description);
