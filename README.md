
# Gsky WPS Client

This service provides a simplified way to make WPS related queries to [gsky](https://github.com/nci/gsky), 
by providing endpoints that accept json data, serializes the data to XML as expected by GSKY WPS queries and parses the response from GSKY to readable JSON, so that you don't have to do this on your frontend.

## Dependencies

The Gsky WPS API service is built using [Node.js](https://nodejs.org/en/), and can be executed either natively or using Docker, each of which has its own set of requirements.

Native execution requires:
- [Node.js](https://nodejs.org/en/)

Execution using Docker requires:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Getting started

Start by cloning the repository from github to your execution environment

```
git clone https://github.com/wmo-raf/gsky-wps-client.git && cd gsky-wps-client
```

After that, follow one of the instructions below:


### Using native execution

1. Create and set up your environment variables. See `.env.sample` for a list of variables you should set, which are described in detail in [this section](#environment-variables) of the documentation

    ```
    cp .env.sample .env
    ```

2. Install node dependencies using yarn:
    ```
    yarn
    ```

3. Start the application server:
    ```
    yarn start
    ```
### Using Docker

1. Create and set up your `.env`. You can find an example `.env.sample` file in the project root.The variables are described in detail in [this section](#environment-variables) of the documentation

    `cp .env.sample .env`

2. Build the image

    `docker build -t gsky_wps_api .`

3. Run the service

`docker run --env-file ./.env -p 3000:3000 gsky_wps_api`


## Environment Variables
- GSKY_OWS_URL => Gsky OWS Url
- GSKY_MAS_URL => Gsky MAS url

## Usage

The service exposes two endpoints:

#### Get latest available time for a gsky layer

```http
  GET /api/v1/gsky/latest_time?data_path=<data_path>&namespace=<namespace>
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `data_path` | `string` | **Required**. The root directory of the netcdf data you want to query in GSKY |
| `namespace` | `string` | **Required**. The netcdf variable name interested in |

Response Sample

```json
{
    "latest_time": "2022-04-05T00:00:00.000Z"
}

```

#### Get timeseries data

```http
  POST /api/v1/gsky/timeseries?identifier=<identifier>&start_datetime=<start_datetime>&end_datetime=<end_datetime>
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `identifier`      | `string` | **Required**. The GSKY WPS process identifier. You can query the available identifiers using `<GSKY_OWS_URL>?service=WPS&version=1.3.0&request=GetCapabilities` |
| `start_datetime` | `string` | **Optional**. The start date to limit the data to. Must be in format `yyyy-MM-ddTHH:mm`. For example `2020-09-08T00:00`|
| `end_datetime` | `string` | **Optional**. The end date to limit the data to. Must be in format `yyyy-MM-ddTHH:mm`. For example `2022-02-22T00:00` |

**Json Body Data** -  `Required`

This should be a `geojson` feature collection with one feature that is either a point, polygon or multipolygon

Point data sample
```json
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    35.815429687500014,
                    0.31860187370565607
                ]
            }
        }
    ]
}
```

Polygon data sample
```json
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            35.815429687500014,
                            0.31860187370565607
                        ],
                        [
                            35.83740234375001,
                            -0.5053645409602878
                        ],
                        [
                            36.9305419921875,
                            -0.5987439850125228
                        ],
                        [
                            36.91955566406251,
                            0.3845185979490167
                        ],
                        [
                            35.815429687500014,
                            0.31860187370565607
                        ]
                    ]
                ]
            }
        }
    ]
}
```

Response sample

```json
{
    "weekly_total_rainfallGeometryDrill": [
        {
            "date": "2020-09-08T00:00:00.000Z",
            "weeklytotalrain": 47.567078
        },
        {
            "date": "2020-09-15T00:00:00.000Z",
            "weeklytotalrain": 25.573235
        },
        {
            "date": "2020-09-22T00:00:00.000Z",
            "weeklytotalrain": 98.398361
        },
        ...
        ]
}      
```

    