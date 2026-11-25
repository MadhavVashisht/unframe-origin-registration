export interface RegistrationFormValues {
  name: string;
  stageName: string;
  age: string;
  city: string;
  contactNumber: string;
  idLast6: string;
  acceptedRules: boolean;
}

export type RegistrationField = keyof RegistrationFormValues;

export type RegistrationErrors = Partial<Record<RegistrationField, string>>;

export type IdFormatHint = 'AADHAAR' | 'PAN' | 'ALPHANUMERIC';

export interface RegistrationPayload {
  registrationId: string;
  event: string;
  presenter: string;
  battleDate: string;
  eventCity: string;
  name: string;
  stageName: string;
  age: number;
  city: string;
  contactNumber: string;
  idLast6: string;
  idFormatHint: IdFormatHint;
  acceptedRules: boolean;
  submittedAt: string;
  webhookToken?: string;
}

export interface SubmissionResult {
  mode: 'google-sheets' | 'api';
  registration: RegistrationPayload;
  message: string;
}
