# maptalks examples

[![Circle CI](https://circleci.com/gh/maptalks/examples/tree/master.svg?style=shield)](https://circleci.com/gh/maptalks/examples/tree/master)

Source repository of [maptalks.js's examples](https://maptalks.github.io/examples/en/map/load/).

## Folder

```bash
.
|- assets/              # assets, CSS/images
|- build/examples.json  # examples index json file
|- dist/                # distribution folder, root for gh-pages branch
|- layouts/             # templates
|- locales/             # i18n configs
|- src/                 # examples sources
```

## Setup

1. At root directory

```bash
npm install
```

2. run

```bash
gulp
```

* copy `assets` to `dist/`
* Compile sources in `src`, generate html files to `dist`
* Start gulp-connet on port 20001, begin to watch file changes to rebuild

3. Open the browser at

* english : [http://localhost:20001/examples/en/](http://localhost:20001/examples/en/)
* chinese: [http://localhost:20001/examples/cn/](http://localhost:20001/examples/cn/)

## Contribute and Publish

Sources files are stored in `master` branch. Once `master` branch is updated with new commits, examples will be compiled and published to `gh-pages` branch automatically.

Any form of contribution is warmly welcomed any time, please submit your pull request to `master` branch (NOT `gh-pages` branch). 
