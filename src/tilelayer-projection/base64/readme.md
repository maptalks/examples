The example of load tile images by BASE64 encoding, a very common way to load offline tiles in mobiles.

You can save tile images in sqlite database, and load them as following:
* Override TileLayer's getTileUrl method, return sqlite url with given x,y,z
* Override TileLayer renderer's getTileImage method, fetch image base64 from sqlite, and set it to Image.src

> Recommend [mbtiles](https://github.com/mapbox/mbtiles-spec), a great spec to store tiles in sqlite database.
