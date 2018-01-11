package main

import (
	"io/ioutil"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

var (
	reAttrbution = regexp.MustCompile(`(attribution: {\s+content: '\$\(attribution\)'\s+})`)
	reSubdomains = regexp.MustCompile(`(subdomains: \$\(subdomains\))`)
)

var newAttribution = `var map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  attribution: true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var attribution = new maptalks.control.Attribution({
  // change default position
  position: {
    bottom: 20,
    right: 75
  }
});
map.addControl(attribution);
`

func attribution(path string, info os.FileInfo) error {
	return ioutil.WriteFile(path, []byte(newAttribution), info.Mode())
}

func others(path string, info os.FileInfo) error {
	bytes, err := ioutil.ReadFile(path)
	if err != nil {
		return err
	}
	content := string(bytes)
	changed := false
	if reAttrbution.Match(bytes) {
		content = reAttrbution.ReplaceAllLiteralString(content, `attribution: true`)
		changed = true
	}
	if reSubdomains.Match(bytes) {
		content = reSubdomains.ReplaceAllLiteralString(content, `subdomains: $(subdomains),
    attribution: '$(attribution)'`)
		changed = true
	}
	if changed {
		return ioutil.WriteFile(path, []byte(content), info.Mode())
	}
	return nil
}

func walk(path string, info os.FileInfo, err error) error {
	if info.IsDir() {
		return nil
	}
	if info.Name() != "index.js" {
		return nil
	}
	if strings.Contains(path, "ui-control") && strings.Contains(path, "control-attribution") {
		return attribution(path, info)
	}
	return others(path, info)
}

func main() {
	if len(os.Args) < 2 {
		os.Exit(1)
	}
	path := os.Args[1]
	filepath.Walk(path, walk)
}
