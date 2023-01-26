const fetchWPSTimeSeries = require("./wps");
const request = require("utils/request");

const GSKY_OWS_URL = process.env.GSKY_OWS_URL;
const GSKY_MAS_URL = process.env.GSKY_MAS_URL;

class GskyWPSService {
  static async wpsGeometryDrill(query, geojson, ctx) {
    let url = GSKY_OWS_URL;

    const parameters = {
      identifier: query.identifier,
      storeExecuteResponse: true,
      status: true,
      dataInputs: [
        {
          inputIdentifier: "geometry",
          inputType: "ComplexData",
          inputValue: JSON.stringify(geojson),
        },
      ],
    };

    if (query.start_datetime) {
      parameters.dataInputs.push({
        inputIdentifier: "start_datetime",
        inputType: "ComplexData",
        inputValue: JSON.stringify({
          properties: { timestamp: { "date-time": query.start_datetime } },
        }),
      });
    }

    if (query.end_datetime) {
      parameters.dataInputs.push({
        inputIdentifier: "end_datetime",
        inputType: "ComplexData",
        inputValue: JSON.stringify({
          properties: { timestamp: { "date-time": query.end_datetime } },
        }),
      });
    }

    if (query.ows_namespace) {
      url = url + `/${query.ows_namespace}`;
    }

    try {
      const data = await fetchWPSTimeSeries(url, parameters);
      return data;
    } catch (error) {
      ctx.throw(400, error);
    }
  }

  static async getLayerLatestTime(ctx) {
    const { namespace, data_path, until } = ctx.query;

    const params = {
      namespace: namespace,
      timestamps: true,
    };

    if (until) {
      params.until = until;
    } else {
      // set a date far away. Gsky by default cuts dates up to today.
      // But Sometimes we want to include data for future dates
      params.until = "2050-01-01";
    }

    const latest_time = await request
      .get(`${GSKY_MAS_URL}/${data_path}`, {
        params: params,
      })
      .then((response) => {
        const { data } = response;

        // TODO : catch more errors

        if (!data.token) {
          ctx.throw(404, `data_path '${data_path}' not found`);
        }

        const res = { latest_time: null };

        if (data && data.timestamps && !!data.timestamps.length) {
          res.latest_time = data.timestamps[data.timestamps.length - 1];
        }

        return res;
      });

    return latest_time;
  }
}

module.exports = GskyWPSService;
