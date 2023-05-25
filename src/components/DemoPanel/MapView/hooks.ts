import { ATTRIBUTION, RESOURCE_PATH, URL_TEMPLATE } from "@/constants";

import { getHtmlCodeTitle } from "@/utils";
import { useAsync } from "react-use";
import { useStore } from "@/store";

export function useMapView() {
  const store = useStore();

  const title = getHtmlCodeTitle(store.selectedKey, store.language);

  useAsync(async () => {
    if (store.selectedKey) {
      const paths = store.selectedKey.split("_");
      const htmlRes = await fetch(
        `/codes/${paths[0]}/${paths[1]}/${paths[2]}/index.html`
      );
      const htmlCode = await htmlRes.text();
      const cssRes = await fetch(
        `/codes/${paths[0]}/${paths[1]}/${paths[2]}/index.css`
      );
      const cssCode = await cssRes.text();
      const jsRes = await fetch(
        `/codes/${paths[0]}/${paths[1]}/${paths[2]}/index.js`
      );
      const jsCode = await jsRes.text();
      const descriptionRes = await fetch(
        `/codes/${paths[0]}/${paths[1]}/${paths[2]}/index_${store.language}.md`
      );
      const description = await descriptionRes.text();
      if (!!description) {
        store.setDescription(description);
      } else {
        store.setDescription("");
      }
      const code = `<!DOCTYPE html>
      <html>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>${title}</title>
        <style type='text/css'>
          ${cssCode.replaceAll("{res}", RESOURCE_PATH)}
        </style>
        <link rel='stylesheet' href='/lib/maptalks.css' />
        <script type='text/javascript' src='/lib/maptalks.min.js'></script>
        <script type='text/javascript' src='http://localhost:6688/packages/gl/dist/maptalksgl.js'></script>
        <script type='text/javascript' src='http://localhost:6688/packages/layer-3dtiles/dist/maptalks.3dtiles.js'></script>
        <script type='text/javascript' src='http://localhost:6688/packages/layer-gltf/dist/maptalks.vt.js'></script>
        <script type='text/javascript' src='http://localhost:6688/packages/layer-gltf/dist/maptalks.gltf.js'></script>
        <script type='text/javascript' src='http://localhost:6688/packages/analysis/dist/maptalks.analysis.js'></script>
        <body>
          ${htmlCode}
          <script>
            ${jsCode
              .replaceAll("{urlTemplate}", URL_TEMPLATE)
              .replaceAll("{attribution}", ATTRIBUTION)
              .replaceAll("{res}", RESOURCE_PATH)}
          </script>
        </body>
      </html>`;
      store.setCode(code);
    } else {
      store.setCode("");
    }
  }, [store.selectedKey, store.language]);

  return {
    code: store.code,
  };
}
