If you want to set more than one base layers to choose from:
1. Initialize map with a GroupTileLayer as the `baseLayer`, set candidate layers as the child layers.
2. Set `visible` option of other layers than the default one to **false** to make them invisible.
3. Layer Switcher will automatically list the layers to choose from.
