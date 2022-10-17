import { Container, View } from "./style";

import { getHtmlCodeTitle } from "@/utils";
import { observer } from "mobx-react-lite";
import { useAsync } from "react-use";
import { useStore } from "@/store";

const urlTemplate = `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png`;
const attribution =
  "&copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/'>CARTO</a>";

function MapView() {
  const store = useStore();

  const title = getHtmlCodeTitle(store.selectedKey, store.language);

  useAsync(async () => {
    if (store.selectedKey) {
      const paths = store.selectedKey.split("_");
      const cssCode = (
        await import(
          `../../../../codes/${paths[0]}/${paths[1]}/${paths[2]}/index.css?raw`
        )
      ).default;
      const htmlCode = (
        await import(
          `../../../../codes/${paths[0]}/${paths[1]}/${paths[2]}/index.html?raw`
        )
      ).default;
      const jsCode = (
        await import(
          `../../../../codes/${paths[0]}/${paths[1]}/${paths[2]}/index.js?raw`
        )
      ).default;
      const code = `<!DOCTYPE html>
      <html>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>${title}</title>
        <style type='text/css'>
          ${cssCode.replaceAll("{res}", "/resources")}
        </style>
        <link rel='stylesheet' href='https://unpkg.com/maptalks/dist/maptalks.css' />
        <script type='text/javascript' src='https://unpkg.com/maptalks/dist/maptalks.min.js'></script>
        <script type='text/javascript' src='https://maptalks.com/api/maptalks-gl-layers.js'></script>
        <body>
          ${htmlCode}
          <script>
            ${jsCode
              .replaceAll("{urlTemplate}", urlTemplate)
              .replaceAll("{attribution}", attribution)
              .replaceAll("{res}", "/resources")}
          </script>
        </body>
      </html>`;
      store.setCode(code);
    } else {
      store.setCode("");
    }
  }, [store.selectedKey, store.language]);

  return (
    <Container>
      <View
        frameBorder={0}
        marginWidth={0}
        marginHeight={0}
        sandbox="allow-modals allow-popups allow-scripts allow-forms allow-same-origin"
        scrolling="no"
        srcDoc={store.code}
      />
    </Container>
  );
}

export default observer(MapView);
