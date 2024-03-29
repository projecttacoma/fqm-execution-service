# fqm-execution-service

Web service wrapper for [fqm-execution](https://github.com/projecttacoma/fqm-execution).

## API

| Endpoint                           | Input                                                                                                                    | Output                                                                                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /calculate`                  | [RequestBody](https://github.com/projecttacoma/fqm-execution-service/blob/master/src/types/server-types.ts#L5)           | [ExecutionResult\[\]](https://github.com/projecttacoma/fqm-execution/blob/794b86ca80c3e0e9dd970c1e049724bf7c67e353/src/types/Calculator.ts#L54) |
| `POST /calculateRaw`               | [RequestBody](https://github.com/projecttacoma/fqm-execution-service/blob/master/src/types/server-types.ts#L5)           | [cql.Results](https://github.com/projecttacoma/fqm-execution/blob/master/src/types/CQLTypes.ts#L14)                                             |
| `POST /calculateMeasureReports`    | [RequestBody](https://github.com/projecttacoma/fqm-execution-service/blob/master/src/types/server-types.ts#L5)           | [fhir4.MeasureReport\[\]](https://www.hl7.org/fhir/measurereport.html)                                                                            |
| `POST /Measure/$care-gaps`         | [RequestBody](https://github.com/projecttacoma/fqm-execution-service/blob/master/src/types/server-types.ts#L5)           | [fhir4.Bundle](https://www.hl7.org/fhir/bundle.html)                                                                                              |
| `POST /Measure/$data-requirements` | [DataRequirementsBody](https://github.com/projecttacoma/fqm-execution-service/blob/master/src/types/server-types.ts#L13) | [fhir4.Library](https://www.hl7.org/fhir/library.html)                                                                                            |

<!-- Note: linked line numbers may be inaccurate as code is updated -->

### Request Inputs

The input to each of the endpoints listed above is expected to be a JSON object, which conforms to the type format specified in [RequestBody](https://github.com/projecttacoma/fqm-execution-service/blob/master/src/types/server-types.ts#L5), or in [DataRequirementsBody](https://github.com/projecttacoma/fqm-execution-service/blob/master/src/types/server-types.ts#L13). This object contains 3 properties:

-   `measure`: a FHIR `Bundle` resource containing the `Measure` object, `Library` objects for every CQL/ELM library used in the measure, 
    as well as `ValueSet` objects with code expansions included.

    -   NOTE: `ValueSet` objects are not needed for `/Measure/$data-requirements`.

-   `patients`: an array of FHIR `Bundle` resources, each of which contains the `Patient` object and any required clinical resources (`Condition`, `Medication`, etc.)
    for measure calculation. This must be an array, even if only one patient is provided.

    -   NOTE: `/Measure/$care-gaps` only accepts 1 patient in this array currently.
    -   NOTE: `/Measure/$data-requirements` does not accept `Patient` resources.

-   `options`: an optional object containing Calculation Options, each of which is listed below, with its default.

    -   NOTE: `/Measure/$data-requirements` does not accept an `options` resource.

#### Calculation Options

The options that we support for calculation are as follows:
| option                 |  type   | optional? |  description                                                                           |
| :--------------------- | :-----: | :-------: |            :-------------------------------------------------------------------------- |
| includeClauseResults   | boolean |    yes    |                                   Option to include clause results. Defaults to false. |
| includePrettyResults   | boolean |    yes    |              Option to include pretty results on statement results. Defaults to false. |
| includeHighlighting    | boolean |    yes    |                    Include highlighting in MeasureReport narrative. Defaults to false. |
| measurementPeriodStart | string  |    yes    |  Start of measurement period. Defaults to the period provided in the `Measure` resource|
| measurementPeriodEnd   | string  |    yes    |   End of measurement period. Defaults to the period provided in the `Measure` resource |
| calculateSDEs          | boolean |    yes    |                 Include Supplemental Data Elementss in calculation. Defaults to false. |
| calculateHTML          | boolean |    yes    |                            Include HTML structure for highlighting. Defaults to false. |
| reportType             | string  |    yes    | Type of MeasureReport to generate: "summary" or "individual". Defaults to "individual".|

These types will be passed through to the calculation service, and will be used in the execution of the measure.

### Request Outputs

Each request output has a different output format, based on the data being conveyed:

-   `/calculate`: an array of `ExecutionResult` objects. Each `ExecutionResult` object contains:

    -   `patient`: the ID of the patient this object is associated with

    -   `detailedResults`, a map of `group`s to an object which contains population-, statement-, and clause-level results for that group, as well as the html

        for that group (if requested by the provided options)

    -   `evaluatedResource`: an array of the FHIR resources used in the calculation of the measure for this patient

    -   `supplementalData`: if requested by the provided options, an array containing the raw and HTML structure results for each 
        supplemental data element in the measure, calculated for the specified patient

-   `/calculateRaw`: a `cql.Result` object, which contains: 

    -   `patientResults`: A map of patient IDs to Statement-level results for that patient

        -   A Statement-level result describes the results of one CQL Statement for this patient, including the name, the Library and ID of the Statement,
            the relevance of a given Statement to a patient population, and the actual result from the patient. See below for an example:

        ```json
        {
               "libraryName": "EXM130",
               "statementName": "Denominator",
               "localId": "37",
               "final": "TRUE",
               "relevance": "TRUE",
               "raw": true,
               "pretty": "true"
        }
        ```

        -   For more information on Clinical Quality Language (CQL) and Expression Logical Model (ELM) formats, see [the CQL specification](https://cql.hl7.org/)

    -   `localIdPatientResultsMap`: A map of patient IDs to the raw results from every clause in every `Library` in the `Measure` resource.

    -   `patientEvaluatedRecords`: A map of patient IDs to the evaluated records for that patient

-   `/Measure/$care-gaps`: a FHIR `Bundle` resource, which contains:

    -   a `Composition` resource containing the actual Gaps in Care report

    -   a `MeasureReport` resource containing the individual measure results for the patient passed in

    -   a set of `DetectedIssue` resources, one for each gap in the measure. Each `DetectedIssue` resource represents a particular gap in care, 
        and will contain one or more `GuidanceResponse` resources detailing the data that could close that gap.

        -   See [this fqm-execution wiki page](https://github.com/projecttacoma/fqm-execution/wiki/Gaps-In-Care) for more detail on the gaps-in-care
            methodology, and how to interpret this output.

-   `/Measure/$data-requirements`: a FHIR module-definition `Library` resource, which contains:
    -   a `dataRequirement` array, with resources for each `datatype`/`valueSet` combination required.

### Calculator Architecture

See [fqm-execution's README](https://github.com/projecttacoma/fqm-execution#architecture-overview) for an overview of the Calculation architecture.

## Usage

### Docker

```bash
docker run -p 3000:3000 tacoma/fqm-execution-service:latest # Run server on port 3000
```

### Local

Run the service with `npm start`. By default, it will run on port 3000. To change the port, do `PORT=XXXX npm start`

## License

Copyright 2020 The MITRE Corporation

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

```bash
http://www.apache.org/licenses/LICENSE-2.0
```

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
