import { DemoPanel, RawPage, ThumbList } from "./components";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import Layout from "./layout";
import examples from "../config/examples";
import { observer } from "mobx-react-lite";
import { useMount } from "react-use";
import { useStore } from "./store";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const store = useStore();

  useMount(() => {
    // languange
    if (location.pathname.includes("/en/")) {
      store.setLanguage("en");
    } else {
      store.setLanguage("cn");
    }
    // redirect
    if (location.pathname === "/") {
      navigate("/examples/cn/basic");
    }
  });

  if (!store.language) {
    return null;
  }

  const languages = ["cn", "en"];

  return (
    <Routes>
      <Route path="/examples" element={<Layout />}>
        {languages.map((language) =>
          examples.map((example) => (
            <Route
              key={`${language}_${example.name}`}
              path={`/examples/${language}/${example.name}`}
              element={<ThumbList />}
            />
          ))
        )}
        {languages.map((language) =>
          examples.map((exampleI) =>
            exampleI.examples.map((exampleJ) =>
              exampleJ.examples.map((exampleK) => (
                <Route
                  key={`${language}_${exampleI.name}_${exampleJ.name}_${exampleK.name}`}
                  path={`/examples/${language}/${exampleI.name}/${exampleJ.name}/${exampleK.name}`}
                  element={<DemoPanel />}
                />
              ))
            )
          )
        )}
      </Route>
      {languages.map((language) =>
        examples.map((exampleI) =>
          exampleI.examples.map((exampleJ) =>
            exampleJ.examples.map((exampleK) => (
              <Route
                key={`${language}_${exampleI.name}_${exampleJ.name}_${exampleK.name}`}
                path={`/examples/raw/${language}/${exampleI.name}/${exampleJ.name}/${exampleK.name}`}
                element={<RawPage />}
              />
            ))
          )
        )
      )}
    </Routes>
  );
}

export default observer(App);
