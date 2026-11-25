import type {
  IdFormatHint,
  RegistrationErrors,
  RegistrationField,
  RegistrationFormValues,
} from '../types/registration';

export const FIELD_ORDER: RegistrationField[] = [
  'name',
  'stageName',
  'age',
  'city',
  'contactNumber',
  'idLast6',
  'acceptedRules',
];

export const FIELD_LABELS: Record<RegistrationField, string> = {
  name: 'Full Name',
  stageName: 'Stage Name',
  age: 'Age',
  city: 'City',
  contactNumber: 'Contact Number',
  idLast6: 'PAN or Aadhaar (Last 6 Digits / Characters)',
  acceptedRules: 'Rules & ID Verification Confirmation',
};

export const FIELD_INPUT_IDS: Record<RegistrationField, string> = {
  name: 'reg-name',
  stageName: 'reg-stage-name',
  age: 'reg-age',
  city: 'reg-city',
  contactNumber: 'reg-contact',
  idLast6: 'reg-id-last6',
  acceptedRules: 'reg-accepted-rules',
};

export const INITIAL_FORM_VALUES: RegistrationFormValues = {
  name: '',
  stageName: '',
  age: '',
  city: '',
  contactNumber: '',
  idLast6: '',
  acceptedRules: false,
};

export function collapseSpaces(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

/**
 * Normalizes Indian mobile numbers while typing or pasting (+91 / 0 prefixes stripped).
 */
export function normalizePhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 10);
}

/**
 * Keeps up to 6 uppercase alphanumeric characters for PAN or Aadhaar check-in verification.
 */
export function normalizeIdLast6Input(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6);
}

/**
 * Infers whether the entered 6 characters match Aadhaar (6 digits), PAN tail ([A-Z]\d{4}[A-Z]),
 * or generic alphanumeric 6-character ID.
 */
export function detectIdFormat(idLast6: string): IdFormatHint | null {
  const clean = normalizeIdLast6Input(idLast6);
  if (clean.length !== 6) {
    return null;
  }
  if (/^\d{6}$/.test(clean)) {
    return 'AADHAAR';
  }
  if (/^[A-Z]\d{4}[A-Z]$/.test(clean)) {
    return 'PAN';
  }
  return 'ALPHANUMERIC';
}

export function validateField(
  field: RegistrationField,
  values: RegistrationFormValues
): string | undefined {
  switch (field) {
    case 'name': {
      const clean = collapseSpaces(values.name);
      if (!clean) {
        return 'Enter your full legal name as printed on your Government ID.';
      }
      if (clean.length < 2) {
        return 'Full name must be at least 2 characters.';
      }
      if (!/[A-Za-z]/.test(clean)) {
        return 'Enter a valid full name using letters.';
      }
      if (clean.length > 80) {
        return 'Full name must be 80 characters or fewer.';
      }
      return undefined;
    }

    case 'stageName': {
      const clean = collapseSpaces(values.stageName);
      if (!clean) {
        return 'Enter your stage name or battle alias.';
      }
      if (clean.length < 2) {
        return 'Stage name must be at least 2 characters.';
      }
      if (clean.length > 50) {
        return 'Stage name must be 50 characters or fewer.';
      }
      return undefined;
    }

    case 'age': {
      const raw = values.age.trim();
      if (!raw) {
        return 'Enter your age.';
      }
      if (!/^\d+$/.test(raw)) {
        return 'Enter your age as a whole number.';
      }
      const parsed = Number.parseInt(raw, 10);
      if (parsed < 12 || parsed > 65) {
        return 'Participant age must be between 12 and 65 years.';
      }
      return undefined;
    }

    case 'city': {
      const clean = collapseSpaces(values.city);
      if (!clean) {
        return 'Enter the city you are representing.';
      }
      if (clean.length < 2) {
        return 'City name must be at least 2 characters.';
      }
      if (!/[A-Za-z]/.test(clean)) {
        return 'Enter a valid city name.';
      }
      if (clean.length > 60) {
        return 'City name must be 60 characters or fewer.';
      }
      return undefined;
    }

    case 'contactNumber': {
      const clean = normalizePhoneInput(values.contactNumber);
      if (!clean) {
        return 'Enter your 10-digit mobile contact number.';
      }
      if (!/^[6-9]\d{9}$/.test(clean)) {
        return 'Enter a valid 10-digit Indian mobile number (starting with 6–9).';
      }
      return undefined;
    }

    case 'idLast6': {
      const clean = normalizeIdLast6Input(values.idLast6);
      if (!clean) {
        return 'Enter the last 6 digits of your Aadhaar or last 6 characters of your PAN.';
      }
      if (clean.length !== 6) {
        return 'Must be exactly 6 characters (e.g. 482910 for Aadhaar or E1234F for PAN).';
      }
      return undefined;
    }

    case 'acceptedRules': {
      if (!values.acceptedRules) {
        return 'Confirm your ID check-in commitment and battle rules before registering.';
      }
      return undefined;
    }
  }
}

export function validateAllFields(values: RegistrationFormValues): RegistrationErrors {
  const errors: RegistrationErrors = {};
  for (const field of FIELD_ORDER) {
    const error = validateField(field, values);
    if (error) {
      errors[field] = error;
    }
  }
  return errors;
}

export function generateRegistrationId(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    for (const b of bytes) {
      suffix += alphabet[b % alphabet.length];
    }
  } else {
    for (let i = 0; i < 4; i += 1) {
      suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
  }
  return `ORG27-${suffix}`;
}
