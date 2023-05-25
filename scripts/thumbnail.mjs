import examples from "../config/examples.json" assert { type: "json" };
import puppeteer from "puppeteer";

// 生成部分例子的缩略图
// 参数说明，name可以分为多级用 "_" 符号连接，例如：
// name: "basic" 生成 codes/basic 目录下的所有例子的缩略图
// name: "basic_3d" 生成 codes/basic/3d 目录下的所有例子的缩略图
// name: "basic_3d_line-altitude" 只生成 codes/basic/3d/line-altitude 这一个例子的缩略图
const name = "vector_operation";

(async () => {
  if (name) {
    genarateByName(name);
  } else {
    await genarateAll();
  }
})();

// 生成所有例子的缩略图
async function genarateAll() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const i of examples) {
    if (i.examples) {
      for (const j of i.examples) {
        if (j.examples) {
          for (const k of j.examples) {
            if (!k.url) {
              const url = `http://localhost:5173/examples/raw/cn/${i.name}/${j.name}/${k.name}`;
              try {
                await page.goto(url, {
                  waitUntil: "networkidle0",
                });
                await page.screenshot({
                  path: `thumbnails/${i.name}_${j.name}_${k.name}.webp`,
                  fullPage: true,
                  type: "webp",
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
  }
  await browser.close();
}

async function genarateByName(name) {
  const paths = name.split("_");
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();
  for (const i of examples) {
    if (i.examples) {
      if (paths[0] && paths[0] !== i.name) {
        continue;
      }
      for (const j of i.examples) {
        if (paths[1] && paths[1] !== j.name) {
          continue;
        }
        if (j.examples) {
          for (const k of j.examples) {
            if (paths[2] && paths[2] !== k.name) {
              continue;
            }
            if (!k.url) {
              const url = `http://localhost:5173/examples/raw/cn/${i.name}/${j.name}/${k.name}`;
              // const url = "https://maptalks.org/examples/cn/tilelayer-projection/epsg4326/raw/index.html"
              try {
                await page.goto(url, {
                  waitUntil: "networkidle0",
                });
                await page.screenshot({
                  path: `public/thumbnails/${i.name}_${j.name}_${k.name}.webp`,
                  fullPage: true,
                  type: "webp",
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
  }
  await browser.close();
}
