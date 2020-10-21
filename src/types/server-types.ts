import { R4 } from '@ahryman40k/ts-fhir-types';
import { CalculatorTypes } from 'fqm-execution';

// Interface for the expected input to the calculate request
export interface RequestBody {
  measure: R4.IBundle;
  patients: R4.IBundle[];
  options?: CalculatorTypes.CalculationOptions;
}
