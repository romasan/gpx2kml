# gpx2kml
Tool for convert [GPX](https://www.topografix.com/GPX/1/1/) into [KML](https://developers.google.com/kml/documentation/)

### Use in terminal
```
$ npm i -g gpx2kml
```

```
$ gpx2kml my_first_track.gpx -o output.kml
```
or
```
$ cat my_first_track.gpx | gpx2kml > output.kml
```

### Use as package
```
import gpx2kml from 'gpx2kml';

const gpx_raw = `<?xml version="1.0" ... </gpx>`;
const kml_raw = gpx2kml(gpx_raw);
```
