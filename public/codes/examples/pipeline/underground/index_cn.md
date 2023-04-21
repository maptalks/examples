#### dataConfig 属性说明

| 属性           | 说明                                        | 类型   | 默认值 |
| -------------- | ------------------------------------------- | ------ | ------ |
| type           | `round-tube`为圆形管，`square-tube`为方形管 | string | 无     |
| radialSegments | 圆的分片数量，`type`为`round-tube`时生效    | number | 8      |
| metric         | 尺寸单位                                    | string | m      |

#### symbol 属性说明

| 属性                 | 说明                   | 类型   | 默认值    |
| -------------------- | ---------------------- | ------ | --------- |
| lineColor            | 管线颜色               | color  | [1,1,1,1] |
| lineWidth            | 管线尺寸               | number | 0         |
| lineHeight           | 管线高度               | number | 0         |
| linePatternFile      | 管线的模式填充图片     | string | 无        |
| uvScale              | 模式填充图片的缩放比例 | [x, y] | [1, 1]    |
| linePatternAnimSpeed | 填充动画               | number | 0         |
| linePatternGap       | 纹理填充间隔           | number | 0         |
| metallicFactor       | 金属度                 | number | 0         |
| roughnessFactor      | 粗糙度                 | number | 0         |
