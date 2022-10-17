import { createContext, useContext } from "react";

import { Store } from "./store";

const StoresContext = createContext(new Store());

function useStore() {
  return useContext(StoresContext);
}

export { useStore };
