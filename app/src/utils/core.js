const { collectionOf } = require("@turf/invariant");

const defined = (value) => {
  return value !== undefined && value !== null;
};

const isValidGeojsonPoint = (geojson) => {
  try {
    collectionOf(geojson, "Point", "validator");
    return true;
  } catch (error) {
    return false;
  }
};

const isValidGeojsonPolygon = (geojson) => {
  try {
    collectionOf(geojson, "Polygon", "validator");
    return true;
  } catch (error) {
    return false;
  }
};

const isValidGeojsonMultiPolygon = (geojson) => {
  try {
    collectionOf(geojson, "MultiPolygon", "validator");
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  defined,
  isValidGeojsonPoint,
  isValidGeojsonPolygon,
  isValidGeojsonMultiPolygon,
};
