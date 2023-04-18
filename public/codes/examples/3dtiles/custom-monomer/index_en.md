#### ColorMask properties

| Properties   | Description              | Type    | Default          |
| ------ | ----------------- | ------- | --------------- |
| symbol | a symbol object like maptalks.Polygon | Object | null           |
| heightRange  | the height array range of color mask      | Array  | null             |

#### Method : setHeightRange(heightRange)
_set a new height range for color mask_
| Parameter | Description | Type | Default |
| ------------- |---------- |-------------|--------- |
| `heightRangge`     | a new height range array | Array | null |

    This sample demonstrates how to generate monomer data for 3dtiles layer by maptalks.ColorMask. You can draw polygons which used to classify 3dtiles into single monomer on the letf map. The left map can not be pitched, and the 3dtiles layer has been flatten so you can draw monomer polygons unaffected by map's projection. The right map will show the 
    monomer immediately when drawing on the letf map. The right top gui controller has two critical parameters to control the mononer's presentation, which are top height and buttom height.

**demonstrate bellow :**</br>
![monomer](https://user-images.githubusercontent.com/5208386/231989198-1092ce95-0805-4019-a859-75c371a24d4a.gif)
