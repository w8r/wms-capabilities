var jsonFormat = global.jsonFormat = require('./json-format');
var xmlFormat = global.xmlFormat = require('./xml-format');
var WMSCapabilities = global.WMSCapabilities = require('../../index');
var Spinner = require('spin.js');
var reqwest = require('reqwest');


////////////////////////////////////////////////////////////////////////////////
var serviceSelect = document.getElementById('service');
var xml = document.getElementById('xml');
var json = document.getElementById('json');
var input = document.getElementById('input-area');

// the only open CORS proxy I could find
var proxy = 'http://jsonp.nodejitsu.com/?url=';
var parser = new WMSCapabilities();

function showInput() {
  xml.style.display = 'none';
  input.style.display = 'block';
}

function hideInput() {
  xml.style.display = 'block';
  input.style.display = 'none';
}

function update(xmlString) {
  xml.textContent = xmlFormat(xmlString);
  Prism.highlightElement(xml);

  json.textContent = jsonFormat(JSON.stringify(parser.parse(xmlString)));
  Prism.highlightElement(json);
}

serviceSelect.addEventListener('change', function() {
  if (serviceSelect.value !== '') {
    hideInput();
    reqwest({
      url: proxy + encodeURIComponent(serviceSelect.value),
      error: function(req) {
        update(JSON.parse(req.responseText).error);
      }
    });
  }
}, false);

xml.addEventListener('click', showInput, false);

input.addEventListener('paste', function() {
  setTimeout(function() {
    update(input.value);
  }, 50);
}, false);
