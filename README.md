# WMS `GetCapabilities` parser

Parses [WMS](http://en.wikipedia.org/wiki/Web_Map_Service) capabilities XML format to JSON. This is a simplified excerpt from [OpenLayers](https://github.com/openlayers/ol3) code to be used separately from its large codebase.

## [Demo](https://w8r.github.io/wms-capabilities)

## Usage

### Browserify
```
npm install wms-capabilities --save-dev
```
```js
var WMSCapabilities = require('wms-capabilities');
...
new WMSCapabilities().parse(xmlString);
//or
new WMSCapabilities(xmlString).toJSON();
```
or
```html
<script src="path/to/wms-capabilities.min.js"></script>
...
new WMSCapabilities().parse(xmlString);
```
