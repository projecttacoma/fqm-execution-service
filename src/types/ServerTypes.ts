import { CalculatorTypes } from 'fqm-execution';

// Interface for the expected input to the calculate request
export interface RequestBody {
  measure: fhir4.Bundle;
  patients: fhir4.Bundle[];
  options?: CalculatorTypes.CalculationOptions;
}

// Interface for the expected input to the data-requirements request
// Separate from the others, because it doesn't accept Patients or options
export interface DataRequirementsBody {
  measure: fhir4.Bundle;
}
