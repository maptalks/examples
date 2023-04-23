#### DataConfig properties

| Properties     | Description                                         | Type   | Default |
| -------------- | --------------------------------------------------- | ------ | ------- |
| type           | `round-tube` or `square-tube`                       | string | none    |
| radialSegments | Radial segments, effective when`type`is`round-tube` | number | 8       |
| metric         | Dimensional units                                   | string | m       |

#### Symbol properties

| Properties           | Description      | Type   | Default   |
| -------------------- | ---------------- | ------ | --------- |
| lineColor            | Color            | color  | [1,1,1,1] |
| lineWidth            | Width            | number | 0         |
| lineHeight           | Height           | number | 0         |
| linePatternFile      | Pattern image    | string | none      |
| uvScale              | Uv scale         | [x, y] | [1, 1]    |
| linePatternAnimSpeed | Animation speed  | number | 0         |
| linePatternGap       | Pattern gap      | number | 0         |
| metallicFactor       | Metallic factor  | number | 0         |
| roughnessFactor      | Roughness factor | number | 0         |
