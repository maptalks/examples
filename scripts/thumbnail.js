const puppeteer = require('puppeteer');
const examples = require('../build/examples.json');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const i of examples) {
    if (i.examples) {
      for (const j of i.examples) {
        if (j.examples) {
          for (const k of j.examples) {
            const url = `http://localhost:20001/examples/cn/${i.name}/${j.name}/${k.name}/raw/index.html`;
            try {
              await page.goto(url, {
                waitUntil: 'networkidle0',
              });
              await page.screenshot({
                path: `thumbnails/${i.name}_${j.name}_${k.name}.webp`,
                fullPage: true,
                type: 'webp',
                quality: 20,
              });
            } catch {
              continue;
            }
          }
        }
      }
    }
  }

  // await page.goto(
  //   'http://localhost:20001/examples/cn/vector/linestyle/bloom/raw/index.html',
  //   {
  //     waitUntil: 'networkidle0',
  //   }
  // );
  // await page.screenshot({
  //   path: 'example.webp',
  //   fullPage: true,
  //   type: 'webp',
  //   quality: 20,
  // });
  await browser.close();
})();
