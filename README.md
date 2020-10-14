# fqm-execution-service

Web service wrapper for [fqm-execution](https://github.com/projecttacoma/fqm-execution).

## API

| Endpoint | Input | Output |
| -------- | ----- | ------ |
| `POST /calculateRaw` | [RequestBody](https://github.com/projecttacoma/fqm-execution-service/blob/master/src/types/server-types.ts#L3) | [cql.Results](https://github.com/projecttacoma/fqm-execution/blob/master/src/types/CQLTypes.ts#L14) |

## Usage

Run the service with `npm start`. By default, it will run on port 3000. To change the port, do `PORT=XXXX npm start`
