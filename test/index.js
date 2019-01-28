"use strict";

import tape from 'tape';
import WMSCapabilities from '../dist/wms-capabilities';
import fs from 'fs';
import path from 'path';


import { DOMParser } from 'xmldom';

tape('WMSCapabilities', function(t) {

  t.test('forecasts.xml', function(t) {
    var url = path.join(process.cwd(), './test/fixtures/forecasts.xml');
    var xml = fs.readFileSync(url, {
      encoding: 'utf-8'
    });
    var json = new WMSCapabilities(undefined, DOMParser).parse(xml);

    t.ok(json, 'got result');
    t.equal(typeof json, 'object', 'parsed');
    t.equal(json.Capability.Layer.Layer[2].Name, "world_rivers", 'contents');

    t.end();
  });

  t.test('obs.xml', function(t) {
    var url = path.join(process.cwd(), './test/fixtures/obs.xml');
    var xml = fs.readFileSync(url, {
      encoding: 'utf-8'
    });
    var json = new WMSCapabilities(xml, DOMParser).toJSON();

    t.ok(json, 'got result');
    t.equal(typeof json, 'object', 'parsed');
    t.equal(json.Capability.Layer.Layer[2].Name, "world_rivers", 'contents');
    t.end();
  });

  t.test('wwa.xml', function(t) {
    var url = path.join(process.cwd(), './test/fixtures/wwa.xml')
    var xml = fs.readFileSync(url, {
      encoding: 'utf-8'
    });
    var json = new WMSCapabilities(xml, DOMParser).toJSON();

    t.ok(json, 'got result');
    t.equal(typeof json, 'object', 'parsed');
    t.equal(json.Capability.Layer.Layer[2].Name, "world_rivers", 'contents');

    t.end();
  });

  t.test('analyses.xml', function(t) {
    var url = path.join(process.cwd(), './test/fixtures/analyses.xml');
    var xml = fs.readFileSync(url, {
      encoding: 'utf-8'
    });
    var json = new WMSCapabilities(xml, DOMParser).toJSON();

    t.ok(json, 'got result');
    t.equal(typeof json, 'object', 'parsed');
    t.equal(json.Capability.Layer.Layer[2].Name, "world_countries_label", 'contents');

    t.end();
  });

  t.test('dmsp.xml', function(t) {
    var url = path.join(process.cwd(), './test/fixtures/dmsp.xml');
    var xml = fs.readFileSync(url, {
      encoding: 'utf-8'
    });
    var json = new WMSCapabilities(xml, DOMParser).toJSON();

    t.ok(json, 'got result');
    t.equal(typeof json, 'object', 'parsed');
    t.equal(json.Capability.Layer.Layer[2].Name, "eez", 'contents');

    t.end();
  });

  t.end();
});
