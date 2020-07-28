# fqm-execution-service

Web service wrapper for [fqm-execution](https://github.com/projecttacoma/fqm-execution).

## API

| Endpoint | Input | Output |
| -------- | ----- | ------ |
| `POST /calculate` | [RequestBody](https://github.com/projecttacoma/fqm-execution-service/blob/master/src/types/server-types.d.ts#L3) | [ExecutionResult](https://github.com/projecttacoma/fqm-execution/blob/master/src/types/Calculator.d.ts#L24) |

## Usage

Run the service with `npm start`. By default, it will run on port 3000. To change the port, do `PORT=XXXX npm start`
