var jsonFormat = global.jsonFormat = require('./json-format');
var xmlFormat = global.xmlFormat = require('./xml-format');
var WMSCapabilities = global.WMSCapabilities || require('../../dist/wms-capabilities.min');
var Spinner = require('spin.js');
var reqwest = global.reqwest = require('reqwest');

////////////////////////////////////////////////////////////////////////////////
var serviceSelect = document.getElementById('service');
var xml = document.getElementById('xml');
var json = document.getElementById('json');
var input = document.getElementById('input-area');

// the only open CORS proxy I could find
var proxy = "https://query.yahooapis.com/v1/public/yql";
var parser = new WMSCapabilities();

function showInput() {
  xml.style.display = 'none';
  input.style.display = 'inline-block';
}

function hideInput() {
  xml.style.display = 'inline-block';
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
      url: proxy,
      data: {
        q: 'select * from xml where url="' +
          serviceSelect.value.replace(/\&amp\;/g, '&') + '"'
      },
      type: "xml",
      crossOrigin: true,
      success: function(xml) {
        update(xml.firstChild.firstChild.innerHTML);
      }
    });
  }
}, false);

xml.addEventListener('click', showInput, false);

input.addEventListener('paste', function() {
  setTimeout(function() {
    update(input.value);
    hideInput();
  }, 50);
}, false);
