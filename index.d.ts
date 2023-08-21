export interface WMSCapabilitiesJSON {
  version: string;
  Service: Service;
  Capability: Capability;
}

export interface Service {
  Name: string;
  Title: string;
  Abstract: string;
  KeywordList: string[];
  OnlineResource: string;
  ContactInformation: ContactInformation;
  Fees: string;
  AccessConstraints: string;
  MaxWidth: number;
  MaxHeight: number;
}

export interface ContactInformation {
  ContactPersonPrimary: ContactPersonPrimary;
  ContactPosition: string;
  ContactAddress: ContactAddress;
  ContactVoiceTelephone: string;
  ContactFacsimileTelephone: string;
  ContactElectronicMailAddress: string;
}

export interface ContactPersonPrimary {
  ContactPerson: string;
  ContactOrganization: string;
}

export interface ContactAddress {
  AddressType: string;
  Address: string;
  City: string;
  StateOrProvince: string;
  PostCode: string;
  Country: string;
}

export interface Capability {
  Request: Request;
  Exception: string[];
  Layer: Layer;
}

export interface Request {
  GetCapabilities: GetCapabilities;
  GetMap: GetMap;
  GetFeatureInfo: GetFeatureInfo;
}

export interface GetCapabilities {
  Format: string[];
  DCPType: Dcptype[];
}

export interface Dcptype {
  HTTP: Http;
}

export interface Http {
  Get: Get;
}

export interface Get {
  OnlineResource: string;
}

export interface GetMap {
  Format: string[];
  DCPType: Dcptype2[];
}

export interface Dcptype2 {
  HTTP: Http2;
}

export interface Http2 {
  Get: Get2;
}

export interface Get2 {
  OnlineResource: string;
}

export interface GetFeatureInfo {
  Format: string[];
  DCPType: Dcptype3[];
}

export interface Dcptype3 {
  HTTP: Http3;
}

export interface Http3 {
  Get: Get3;
}

export interface Get3 {
  OnlineResource: string;
}

export interface Layer {
  queryable: boolean;
  Title: string;
  CRS: string[];
  EX_GeographicBoundingBox: number[];
  BoundingBox: BoundingBox[];
  Layer: Layer2[];
}

export interface BoundingBox {
  crs: string;
  extent: number[];
  res: any[];
}

export interface Layer2 {
  Title: string;
  Abstract: string;
  CRS: string[];
  EX_GeographicBoundingBox: number[];
  BoundingBox: BoundingBox2[];
  Dimension: Dimension[];
  Layer: Layer3[];
  queryable: boolean;
  opaque: boolean;
  noSubsets: boolean;
}

export interface BoundingBox2 {
  crs: string;
  extent: number[];
  res: any[];
}

export interface Dimension {
  name: string;
  units: string;
  unitSymbol: any;
  default: any;
  current: boolean;
  values: string;
}

export interface Layer3 {
  Name: string;
  Title: string;
  Abstract: string;
  CRS: string[];
  EX_GeographicBoundingBox: number[];
  BoundingBox: BoundingBox3[];
  Style: Style[];
  queryable: boolean;
  opaque: boolean;
  noSubsets: boolean;
  Dimension: Dimension2[];
}

export interface BoundingBox3 {
  crs: string;
  extent: number[];
  res: any[];
}

export interface Style {
  Name: string;
  Title: string;
  LegendURL: LegendUrl[];
}

export interface LegendUrl {
  Format: string;
  OnlineResource: string;
  size: number[];
}

export interface Dimension2 {
  name: string;
  units: string;
  unitSymbol: any;
  default: any;
  current: boolean;
  values: string;
}

export default class WMS {
  /**
   * WMS Capabilities parser
   *
   * @param {String=} xmlString
   * @constructor
   */
  constructor(xmlString?: string | undefined, DOMParser?: any);
  /**
   * @type {String}
   */
  version: string;
  /**
   * @type {XMLParser}
   */
  _parser: XMLParser;
  /**
   * @type {String=}
   */
  _data: string | undefined;
  /**
   * @param {String} xmlString
   * @return {WMS}
   */
  data(xmlString: string): WMS;
  /**
   * @param  {String=} xmlString
   * @return {Object|null}
   */
  toJSON(xmlString?: string | undefined): WMSCapabilitiesJSON | null;
  /**
   * @return {String} xml
   * @return {Object|null}
   */
  parse(xmlString: any): WMSCapabilitiesJSON;
  /**
   * @param  {Document} doc
   * @return {Object|null}
   */
  readFromDocument(doc: Document): WMSCapabilitiesJSON | null;
  /**
   * @param  {DOMNode} node
   * @return {Object}
   */
  readFromNode(node: DOMNode): WMSCapabilitiesJSON;
}

class XMLParser {
  /**
   * XML DOM parser
   * @constructor
   * @param {DOMParser} DOMParser
   */
  constructor(DOMParser: DOMParser);
  /**
   * @type {DOMParser}
   */
  _parser: DOMParser;
  /**
   * @param  {String} xmlstring
   * @return {Document}
   */
  toDocument(xmlstring: string): Document;
  /**
   * Recursively grab all text content of child nodes into a single string.
   * @param {Node} node Node.
   * @param {boolean} normalizeWhitespace Normalize whitespace: remove all line
   * breaks.
   * @return {string} All text content.
   * @api
   */
  getAllTextContent(node: Node, normalizeWhitespace: boolean): string;
}
