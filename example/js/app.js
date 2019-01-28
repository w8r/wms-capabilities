import jsonFormat from './json-format';
import xmlFormat from './xml-format';
import WMSCapabilities from '../../dist/wms-capabilities.min';
//import Spinner from 'spin.js';

////////////////////////////////////////////////////////////////////////////////
var serviceSelect = document.getElementById('service');
var xml = document.getElementById('xml');
var json = document.getElementById('json');
var input = document.getElementById('input-area');

// the only open CORS proxy I could find
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

    fetch(serviceSelect.value)
      .then(response => response.text())
      .then(xmlString => update(xmlString));
  }
}, false);

xml.addEventListener('click', showInput, false);

input.addEventListener('paste', function() {
  setTimeout(function() {
    update(input.value);
    hideInput();
  }, 50);
}, false);
