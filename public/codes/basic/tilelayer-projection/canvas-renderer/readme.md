TileLayer has 2 renderers: `canvas` and `gl`(default). When browser doesn't support webgl(IE9/10), it will switch to `canvas` automatically.

The differences between them are:

| renderer | IE9/10 | 3D  | [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) required |
| -------- | ------ | --- | -------------------------------------------------------------------------------------- |
| gl       | NO     | YES | YES                                                                                    |
| canvas   | YES    | NO  | NO\*                                                                                   |

\* When exporting map's image by calling map.toDataURL, CORS is required and TileLayer must set crossOrigin in options.
