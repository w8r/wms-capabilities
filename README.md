# WMS `GetCapabilities` parser
[![npm version](https://badge.fury.io/js/wms-capabilities.svg)](http://badge.fury.io/js/wms-capabilities)

Parses [WMS](http://en.wikipedia.org/wiki/Web_Map_Service) capabilities XML format to JSON. This is a simplified excerpt from [OpenLayers](https://github.com/openlayers/ol3) code to be used separately from its large codebase.

## [Demo](https://w8r.github.io/wms-capabilities)

## Usage

### Browserify
```
npm install wms-capabilities --save
```
```js
var WMSCapabilities = require('wms-capabilities');
...
new WMSCapabilities().parse(xmlString);
//or
new WMSCapabilities(xmlString).toJSON();
```
### Browser
```html
<script src="path/to/wms-capabilities.min.js"></script>
...
new WMSCapabilities().parse(xmlString);
```

### Node

Requires `xmldom` to traverse XML
```sh
$npm install --save xmldom
```
then
```js
var DOMParser = global.DOMParser = require('xmldom').DOMParser;
var WMSCapabilities = require('wms-capabilities');
...
new WMSCapabilities(xmlString).toJSON();
```

### Command-line

```sh
$ npm install -g wms-capabilities
$ cat capabilities.xml | wmscapabilities > out.json
$ # or
$ wmscapabilities capabilities.json > out.json
```
