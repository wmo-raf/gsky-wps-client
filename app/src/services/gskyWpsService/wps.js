const Mustache = require("mustache");

const request = require("utils/request");
const xml2json = require("utils/xml2json");
const csv = require("utils/csv");
const { defined } = require("utils/core");
const executeWpsTemplate = require("./ExecuteWpsTemplate.xml.js");

// Originally from jquery-csv plugin. Modified to avoid stripping leading zeros.
function castToScalar(value, state) {
  if (state.rowNum === 1) {
    // Don't cast column names
    return value;
  } else {
    var hasDot = /\./;
    var leadingZero = /^0[0-9]/;
    var numberWithThousands = /^[1-9]\d?\d?(,\d\d\d)+(\.\d+)?$/;
    if (numberWithThousands.test(value)) {
      value = value.replace(/,/g, "");
    }
    if (isNaN(value)) {
      return value;
    }
    if (leadingZero.test(value)) {
      return value;
    }
    if (hasDot.test(value)) {
      return parseFloat(value);
    }
    var integer = parseInt(value, 10);
    if (isNaN(integer)) {
      return null;
    }
    return integer;
  }
}

const fetchWPSTimeSeries = (url, parameters) => {
  const xmlInput = Mustache.render(executeWpsTemplate, parameters);

  const url_params = {
    service: "WPS",
    request: "Execute",
  };

  return request({
    method: "POST",
    data: xmlInput,
    url: url,
    params: url_params,
  }).then((response) => {
    const xml = response.data;
    const json = xml2json(xml);

    const processOutputs = json.ProcessOutputs;

    let outputs = processOutputs.Output;

    if (outputs && !Array.isArray(outputs)) {
      outputs = [outputs];
    }

    if (!outputs && processOutputs.Data) {
      outputs = [processOutputs];
    }

    const results = {};

    for (var i = 0; i < outputs.length; ++i) {
      if (!defined(outputs[i].Data)) {
        continue;
      }

      if (defined(outputs[i].Data.ComplexData)) {
        if (
          outputs[i].Data.ComplexData.mimeType ===
          "application/vnd.terriajs.catalog-member+json"
        ) {
          var jsonObj = JSON.parse(outputs[i].Data.ComplexData.text);
          const data = csv.toObjects(jsonObj.data, {
            onParseValue: castToScalar,
          });

          results[outputs[i].Identifier] = data;
        }
      }
    }

    return results;
  });
};

module.exports = fetchWPSTimeSeries;
