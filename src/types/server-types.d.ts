import { R4 } from '@ahryman40k/ts-fhir-types';

export interface RequestBody {
  measure: R4.IBundle;
  patient: R4.IBundle;
  options?: {
    [optionName: string]: any;
  };
}
