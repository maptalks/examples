图层的 cssFilter 属性可以用 [css filter](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter) 来给图层设置风格滤镜。

你可以在[这个表格](https://github.com/maptalks/maptalks.js/wiki/css-filter)里查看更多常用滤镜设置。  

该功能是canvas特有的,如果你把tilelayer加到GroupGLLayer,因为采用webgl渲染，这个功能将失效,建议使用下一个例子的方式来处理瓦片的自定义
