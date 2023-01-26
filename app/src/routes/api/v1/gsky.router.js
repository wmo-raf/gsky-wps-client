const Router = require("koa-router");
const isEmpty = require("lodash/isEmpty");
const GskyWPSService = require("services/gskyWpsService");
const {
  isValidGeojsonPoint,
  isValidGeojsonPolygon,
  isValidGeojsonMultiPolygon,
} = require("utils/core");

const router = new Router({
  prefix: "/gsky",
});

class GskyRouter {
  static async wpsExecuteGeometryDrillProcess(ctx) {
    ctx.assert(ctx.query.identifier, 400, "identifier required");

    ctx.assert(
      !isEmpty(ctx.request.body),
      400,
      "Geojson Point or Polygon required"
    );

    // check if point or polygon
    ctx.assert(
      isValidGeojsonPoint(ctx.request.body) ||
        isValidGeojsonPolygon(ctx.request.body) ||
        isValidGeojsonMultiPolygon(ctx.request.body),
      400,
      "Invalid feature"
    );

    ctx.body = await GskyWPSService.wpsGeometryDrill(
      ctx.query,
      ctx.request.body,
      ctx
    );
  }

  static async getLayerLatestTime(ctx) {
    ctx.assert(
      ctx.query.data_path,
      400,
      "Data path required. This corresponds to the root directory of the netcdf data you want to query in GSKY"
    );
    ctx.assert(
      ctx.query.namespace,
      400,
      "namespace required. This corresponds to the netcdf variable name"
    );

    ctx.body = await GskyWPSService.getLayerLatestTime(ctx);
  }
}

router.get("/latest_time", GskyRouter.getLayerLatestTime);
router.post("/timeseries", GskyRouter.wpsExecuteGeometryDrillProcess);

module.exports = router;
