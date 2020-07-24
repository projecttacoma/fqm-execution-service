import { R4 } from '@ahryman40k/ts-fhir-types';

// Interface for the expected input to the calculate request
export interface RequestBody {
  measure: R4.IBundle;
  patient: R4.IBundle[];
  options?: {
    [optionName: string]: any; // TODO: Define the options we want to support
  };
}
