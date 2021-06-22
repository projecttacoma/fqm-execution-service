import { R4 } from '@ahryman40k/ts-fhir-types';
import { CalculatorTypes } from 'fqm-execution';

// Interface for the expected input to the calculate request
export interface RequestBody {
  measure: R4.IBundle;
  patients: R4.IBundle[];
  options?: CalculatorTypes.CalculationOptions;
}

// Interface for the expected input to the data-requirements request
// Separate from the others, because it doesn't accept Patients or options
export interface DataRequirementsBody {
  measure: R4.IBundle;
}
