# fqm-execution-service

Web service wrapper for [fqm-execution](https://github.com/projecttacoma/fqm-execution).

## API

| Endpoint | Input | Output |
| -------- | ----- | ------ |

| `POST /calculate` | [RequestBody](https://github.com/projecttacoma/fqm-execution-service/blob/master/src/types/server-types.ts#L3) | [ExecutionResult[]](https://github.com/projecttacoma/fqm-execution/blob/ae4cb08be1796f30a0372d1f06a3167b20c6f25f/src/types/Calculator.ts#L47) |
| `POST /calculateRaw` | [RequestBody](https://github.com/projecttacoma/fqm-execution-service/blob/master/src/types/server-types.ts#L3) | [cql.Results](https://github.com/projecttacoma/fqm-execution/blob/master/src/types/CQLTypes.ts#L14) |
| `POST /calculateMeasureReports` | [RequestBody](https://github.com/projecttacoma/fqm-execution-service/blob/master/src/types/server-types.ts#L3) | [R4.IMeasureReport[]](https://www.hl7.org/fhir/measurereport.html) |
| `POST /Measure/$care-gaps` | [RequestBody](https://github.com/projecttacoma/fqm-execution-service/blob/master/src/types/server-types.ts#L3) | [R4.IBundle](https://www.hl7.org/fhir/bundle.html) |
<!-- Note: linked line numbers may be inaccurate as code is updated -->

## Usage

Run the service with `npm start`. By default, it will run on port 3000. To change the port, do `PORT=XXXX npm start`
