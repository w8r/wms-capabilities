import XMLParser, { 
  makeObjectPropertySetter,
  makeObjectPropertyPusher,
  makeParsersNS,
  pushParseAndPop,
  makeArrayPusher
} from './xml_parser';
import { 
  readString,
  readDecimalString,
  readBooleanString,
  readNonNegativeIntegerString,
  readNonNegativeInteger,
  readDecimal
} from './xsd';
import { readHref } from './xlink';
import setIfUndefined from './utils/setifundefined';
import isDef from './utils/isdef';

/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} Attribution object.
 */
function readAttribution(node, objectStack) {
  return pushParseAndPop({}, ATTRIBUTION_PARSERS, node, objectStack);
}


/**
 * @private
 * @param {Node} node Node.
 * @return {ol.Extent} Bounding box object.
 */
function readBoundingBoxExtent (node) {
  return [
    readDecimalString(node.getAttribute('minx')),
    readDecimalString(node.getAttribute('miny')),
    readDecimalString(node.getAttribute('maxx')),
    readDecimalString(node.getAttribute('maxy'))
  ];
}

/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object} Bounding box object.
 */
function readBoundingBox (node, objectStack) {
  const extent = readBoundingBoxExtent(node);
  const resolutions = [
    readDecimalString(node.getAttribute('resx')),
    readDecimalString(node.getAttribute('resy'))
  ];

  return {
    'crs': node.getAttribute('CRS') || node.getAttribute('SRS'),
    extent, res: resolutions
  };
}

/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {ol.Extent|undefined} Bounding box object.
 */
function readLatLonBoundingBox (node, objectStack) {
  const extent = readBoundingBoxExtent(node);

  if (!isDef(extent[0]) || !isDef(extent[1]) ||
    !isDef(extent[2]) || !isDef(extent[3])) {
    return undefined;
  }

  return extent;
}


/**
 * @privat
 * @param  {Node} node  Node
 * @param  {Arra.<Object>} objectStack Object stack
 * @return {Object}
 */
function readScaleHint (node, objectStack) {
  const min = parseFloat(node.getAttribute('min'));
  const max = parseFloat(node.getAttribute('max'));

  return { min, max };
}


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {ol.Extent|undefined} Bounding box object.
 */
function readEXGeographicBoundingBox (node, objectStack) {
  const geographicBoundingBox = pushParseAndPop({},
    EX_GEOGRAPHIC_BOUNDING_BOX_PARSERS,
    node, objectStack);
  if (!isDef(geographicBoundingBox)) return undefined;

  const westBoundLongitude = /** @type {number|undefined} */
    (geographicBoundingBox['westBoundLongitude']);
  const southBoundLatitude = /** @type {number|undefined} */
    (geographicBoundingBox['southBoundLatitude']);
  const eastBoundLongitude = /** @type {number|undefined} */
    (geographicBoundingBox['eastBoundLongitude']);
  const northBoundLatitude = /** @type {number|undefined} */
    (geographicBoundingBox['northBoundLatitude']);

  if (!isDef(westBoundLongitude) || !isDef(southBoundLatitude) ||
    !isDef(eastBoundLongitude) || !isDef(northBoundLatitude)) {
    return undefined;
  }

  return [
    westBoundLongitude, southBoundLatitude,
    eastBoundLongitude, northBoundLatitude
  ];
}


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object|undefined} Capability object.
 */
function readCapability (node, objectStack) {
  return pushParseAndPop({}, CAPABILITY_PARSERS, node, objectStack);
}


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object|undefined} Service object.
 */
function readService (node, objectStack) {
  return pushParseAndPop({}, SERVICE_PARSERS, node, objectStack);
}


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object|undefined} Contact information object.
 */
function readContactInformation (node, objectStack) {
  return pushParseAndPop({}, CONTACT_INFORMATION_PARSERS,
    node, objectStack);
}


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object|undefined} Contact person object.
 */
function readContactPersonPrimary (node, objectStack) {
  return pushParseAndPop({}, CONTACT_PERSON_PARSERS,
    node, objectStack);
}


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object|undefined} Contact address object.
 */
function readContactAddress (node, objectStack) {
  return pushParseAndPop({}, CONTACT_ADDRESS_PARSERS,
    node, objectStack);
}


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Array.<string>|undefined} Format array.
 */
function readException (node, objectStack) {
  return pushParseAndPop(
    [], EXCEPTION_PARSERS, node, objectStack);
}


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object|undefined} Layer object.
 */
function readCapabilityLayer (node, objectStack) {
  const queryable = readBooleanString(node.getAttribute('queryable'));  
  return pushParseAndPop({
    queryable: isDef(queryable) ? queryable : false }, 
    LAYER_PARSERS, node, objectStack);
}


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} Layer object.
 */
function readLayer (node, objectStack) {
  var parentLayerObject = /**  @type {Object.<string,*>} */
    (objectStack[objectStack.length - 1]);

  const layerObject = /**  @type {Object.<string,*>} */
    (pushParseAndPop({}, LAYER_PARSERS,
      node, objectStack));

  if (!isDef(layerObject)) return undefined;

  let queryable = readBooleanString(node.getAttribute('queryable'));
  if (!isDef(queryable)) {
    queryable = parentLayerObject['queryable'];
  }
  layerObject['queryable'] = isDef(queryable) ? queryable : false;

  let cascaded = readNonNegativeIntegerString(node.getAttribute('cascaded'));
  if (!isDef(cascaded)) {
    cascaded = parentLayerObject['cascaded'];
  }
  layerObject['cascaded'] = cascaded;

  let opaque = readBooleanString(node.getAttribute('opaque'));
  if (!isDef(opaque)) {
    opaque = parentLayerObject['opaque'];
  }
  layerObject['opaque'] = isDef(opaque) ? opaque : false;

  let noSubsets = readBooleanString(node.getAttribute('noSubsets'));
  if (!isDef(noSubsets)) {
    noSubsets = parentLayerObject['noSubsets'];
  }
  layerObject['noSubsets'] = isDef(noSubsets) ? noSubsets : false;

  let fixedWidth = readDecimalString(node.getAttribute('fixedWidth'));
  if (!isDef(fixedWidth)) {
    fixedWidth = parentLayerObject['fixedWidth'];
  }
  layerObject['fixedWidth'] = fixedWidth;

  let fixedHeight = readDecimalString(node.getAttribute('fixedHeight'));
  if (!isDef(fixedHeight)) {
    fixedHeight = parentLayerObject['fixedHeight'];
  }
  layerObject['fixedHeight'] = fixedHeight;

  // See 7.2.4.8
  const addKeys = ['Style', 'CRS', 'AuthorityURL'];
  for (let i = 0, len = addKeys.length; i < len; i++) {
    const key = addKeys[i];
    const parentValue = parentLayerObject[key];
    if (isDef(parentValue)) {
      let childValue = setIfUndefined(layerObject, key, []);
      childValue = childValue.concat(parentValue);
      layerObject[key] = childValue;
    }
  }

  const replaceKeys = ['EX_GeographicBoundingBox', 'BoundingBox', 'Dimension',
    'Attribution', 'MinScaleDenominator', 'MaxScaleDenominator'
  ];
  for (let i = 0, len = replaceKeys.length; i < len; i++) {
    const key = replaceKeys[i];
    const childValue = layerObject[key];
    if (!isDef(childValue)) {
      const parentValue = parentLayerObject[key];
      layerObject[key] = parentValue;
    }
  }

  return layerObject;
}


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object} Dimension object.
 */
function readDimension (node, objectStack) {
  return {
    'name': node.getAttribute('name'),
    'units': node.getAttribute('units'),
    'unitSymbol': node.getAttribute('unitSymbol'),
    'default': node.getAttribute('default'),
    'multipleValues': readBooleanString(node.getAttribute('multipleValues')),
    'nearestValue': readBooleanString(node.getAttribute('nearestValue')),
    'current': readBooleanString(node.getAttribute('current')),
    'values': readString(node)
  };
}


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} Online resource object.
 */
function readFormatOnlineresource (node, objectStack) {
  return pushParseAndPop({}, FORMAT_ONLINERESOURCE_PARSERS,
    node, objectStack);
}


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} Request object.
 */
function readRequest (node, objectStack) {
  return pushParseAndPop({}, REQUEST_PARSERS, node, objectStack);
}


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} DCP type object.
 */
function readDCPType (node, objectStack) {
  return pushParseAndPop({}, DCPTYPE_PARSERS, node, objectStack);
}


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} HTTP object.
 */
function readHTTP (node, objectStack) {
  return pushParseAndPop({}, HTTP_PARSERS, node, objectStack);
}


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} Operation type object.
 */
function readOperationType (node, objectStack) {
  return pushParseAndPop({}, OPERATIONTYPE_PARSERS, node, objectStack);
}


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} Online resource object.
 */
function readSizedFormatOnlineresource (node, objectStack) {
  var formatOnlineresource = readFormatOnlineresource(node, objectStack);
  if (isDef(formatOnlineresource)) {
    const size = [
      readNonNegativeIntegerString(node.getAttribute('width')),
      readNonNegativeIntegerString(node.getAttribute('height'))
    ];
    formatOnlineresource['size'] = size;
    return formatOnlineresource;
  }
  return undefined;
}


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} Authority URL object.
 */
function readAuthorityURL (node, objectStack) {
  var authorityObject = readFormatOnlineresource(node, objectStack);
  if (isDef(authorityObject)) {
    authorityObject['name'] = node.getAttribute('name');
    return authorityObject;
  }
  return undefined;
}


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} Metadata URL object.
 */
function readMetadataURL (node, objectStack) {
  var metadataObject = readFormatOnlineresource(node, objectStack);
  if (isDef(metadataObject)) {
    metadataObject['type'] = node.getAttribute('type');
    return metadataObject;
  }
  return undefined;
}


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} Style object.
 */
function readStyle (node, objectStack) {
  return pushParseAndPop({}, STYLE_PARSERS, node, objectStack);
}


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Array.<string>|undefined} Keyword list.
 */
function readKeywordList (node, objectStack) {
  return pushParseAndPop(
    [], KEYWORDLIST_PARSERS, node, objectStack);
}


/**
 * @const
 * @type {Array.<string>}
 */
const NAMESPACE_URIS = [
  null,
  'http://www.opengis.net/wms'
];

/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
export const PARSERS = makeParsersNS(
  NAMESPACE_URIS, {
    'Service': makeObjectPropertySetter(readService),
    'Capability': makeObjectPropertySetter(readCapability)
  });

/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
const CAPABILITY_PARSERS = makeParsersNS(
  NAMESPACE_URIS, {
    'Request': makeObjectPropertySetter(readRequest),
    'Exception': makeObjectPropertySetter(readException),
    'Layer': makeObjectPropertySetter(readCapabilityLayer)
  });

/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
const SERVICE_PARSERS = makeParsersNS(
  NAMESPACE_URIS, {
    'Name': makeObjectPropertySetter(readString),
    'Title': makeObjectPropertySetter(readString),
    'Abstract': makeObjectPropertySetter(readString),
    'KeywordList': makeObjectPropertySetter(readKeywordList),
    'OnlineResource': makeObjectPropertySetter(readHref),
    'ContactInformation': makeObjectPropertySetter(readContactInformation),
    'Fees': makeObjectPropertySetter(readString),
    'AccessConstraints': makeObjectPropertySetter(readString),
    'LayerLimit': makeObjectPropertySetter(readNonNegativeInteger),
    'MaxWidth': makeObjectPropertySetter(readNonNegativeInteger),
    'MaxHeight': makeObjectPropertySetter(readNonNegativeInteger)
  });

/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
const CONTACT_INFORMATION_PARSERS = makeParsersNS(
  NAMESPACE_URIS, {
    'ContactPersonPrimary': makeObjectPropertySetter(readContactPersonPrimary),
    'ContactPosition': makeObjectPropertySetter(readString),
    'ContactAddress': makeObjectPropertySetter(readContactAddress),
    'ContactVoiceTelephone': makeObjectPropertySetter(readString),
    'ContactFacsimileTelephone': makeObjectPropertySetter(readString),
    'ContactElectronicMailAddress': makeObjectPropertySetter(readString)
  });

/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
const CONTACT_PERSON_PARSERS = makeParsersNS(
  NAMESPACE_URIS, {
    'ContactPerson': makeObjectPropertySetter(readString),
    'ContactOrganization': makeObjectPropertySetter(readString)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
const CONTACT_ADDRESS_PARSERS = makeParsersNS(
  NAMESPACE_URIS, {
    'AddressType': makeObjectPropertySetter(readString),
    'Address': makeObjectPropertySetter(readString),
    'City': makeObjectPropertySetter(readString),
    'StateOrProvince': makeObjectPropertySetter(readString),
    'PostCode': makeObjectPropertySetter(readString),
    'Country': makeObjectPropertySetter(readString)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
const EXCEPTION_PARSERS = makeParsersNS(
  NAMESPACE_URIS, {
    'Format': makeArrayPusher(readString)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
const LAYER_PARSERS = makeParsersNS(
  NAMESPACE_URIS, {
    'Name': makeObjectPropertySetter(readString),
    'Title': makeObjectPropertySetter(readString),
    'Abstract': makeObjectPropertySetter(readString),
    'KeywordList': makeObjectPropertySetter(readKeywordList),
    'CRS': makeObjectPropertyPusher(readString),
    'SRS': makeObjectPropertyPusher(readString),
    'EX_GeographicBoundingBox': makeObjectPropertySetter(readEXGeographicBoundingBox),
    'LatLonBoundingBox': makeObjectPropertySetter(readLatLonBoundingBox),
    'BoundingBox': makeObjectPropertyPusher(readBoundingBox),
    'Dimension': makeObjectPropertyPusher(readDimension),
    'Attribution': makeObjectPropertySetter(readAttribution),
    'AuthorityURL': makeObjectPropertyPusher(readAuthorityURL),
    'Identifier': makeObjectPropertyPusher(readString),
    'MetadataURL': makeObjectPropertyPusher(readMetadataURL),
    'DataURL': makeObjectPropertyPusher(readFormatOnlineresource),
    'FeatureListURL': makeObjectPropertyPusher(readFormatOnlineresource),
    'Style': makeObjectPropertyPusher(readStyle),
    'MinScaleDenominator': makeObjectPropertySetter(readDecimal),
    'MaxScaleDenominator': makeObjectPropertySetter(readDecimal),
    'ScaleHint': makeObjectPropertySetter(readScaleHint),
    'Layer': makeObjectPropertyPusher(readLayer)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
const ATTRIBUTION_PARSERS = makeParsersNS(
  NAMESPACE_URIS, {
    'Title': makeObjectPropertySetter(readString),
    'OnlineResource': makeObjectPropertySetter(readHref),
    'LogoURL': makeObjectPropertySetter(readSizedFormatOnlineresource)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
const EX_GEOGRAPHIC_BOUNDING_BOX_PARSERS =
  makeParsersNS(NAMESPACE_URIS, {
    'westBoundLongitude': makeObjectPropertySetter(readDecimal),
    'eastBoundLongitude': makeObjectPropertySetter(readDecimal),
    'southBoundLatitude': makeObjectPropertySetter(readDecimal),
    'northBoundLatitude': makeObjectPropertySetter(readDecimal)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
const REQUEST_PARSERS = makeParsersNS(
  NAMESPACE_URIS, {
    'GetCapabilities': makeObjectPropertySetter(
      readOperationType),
    'GetMap': makeObjectPropertySetter(
      readOperationType),
    'GetFeatureInfo': makeObjectPropertySetter(
      readOperationType)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
const OPERATIONTYPE_PARSERS = makeParsersNS(
  NAMESPACE_URIS, {
    'Format': makeObjectPropertyPusher(readString),
    'DCPType': makeObjectPropertyPusher(
      readDCPType)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
const DCPTYPE_PARSERS = makeParsersNS(
  NAMESPACE_URIS, {
    'HTTP': makeObjectPropertySetter(
      readHTTP)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
const HTTP_PARSERS = makeParsersNS(
  NAMESPACE_URIS, {
    'Get': makeObjectPropertySetter(
      readFormatOnlineresource),
    'Post': makeObjectPropertySetter(
      readFormatOnlineresource)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
const STYLE_PARSERS = makeParsersNS(
  NAMESPACE_URIS, {
    'Name': makeObjectPropertySetter(readString),
    'Title': makeObjectPropertySetter(readString),
    'Abstract': makeObjectPropertySetter(readString),
    'LegendURL': makeObjectPropertyPusher(readSizedFormatOnlineresource),
    'StyleSheetURL': makeObjectPropertySetter(readFormatOnlineresource),
    'StyleURL': makeObjectPropertySetter(readFormatOnlineresource)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
const FORMAT_ONLINERESOURCE_PARSERS = makeParsersNS(
  NAMESPACE_URIS, {
    'Format': makeObjectPropertySetter(readString),
    'OnlineResource': makeObjectPropertySetter(readHref)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
const KEYWORDLIST_PARSERS = makeParsersNS(
  NAMESPACE_URIS, {
    'Keyword': makeArrayPusher(readString)
  });
