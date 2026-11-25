import assert from 'node:assert/strict';
import test from 'node:test';
import {
  detectIdFormat,
  generateRegistrationId,
  INITIAL_FORM_VALUES,
  normalizeIdLast6Input,
  normalizePhoneInput,
  validateAllFields,
  validateField,
} from '../src/utils/validation.ts';

test('normalizePhoneInput strips +91, 0, spaces, and punctuation cleanly', () => {
  assert.equal(normalizePhoneInput('+91 98765 43210'), '9876543210');
  assert.equal(normalizePhoneInput('09876543210'), '9876543210');
  assert.equal(normalizePhoneInput('98765-43210'), '9876543210');
  assert.equal(normalizePhoneInput('9876543210123'), '9876543210');
});

test('normalizeIdLast6Input uppercases and strips non-alphanumeric chars', () => {
  assert.equal(normalizeIdLast6Input('e1234f'), 'E1234F');
  assert.equal(normalizeIdLast6Input(' 482 910 '), '482910');
  assert.equal(normalizeIdLast6Input('ab-12#34cd'), 'AB1234');
});

test('detectIdFormat identifies Aadhaar, PAN, and generic 6-char IDs', () => {
  assert.equal(detectIdFormat('482910'), 'AADHAAR');
  assert.equal(detectIdFormat('E1234F'), 'PAN');
  assert.equal(detectIdFormat('AB12CD'), 'ALPHANUMERIC');
  assert.equal(detectIdFormat('12345'), null);
});

test('validateAllFields catches empty required fields', () => {
  const errors = validateAllFields(INITIAL_FORM_VALUES);
  assert.equal(Object.keys(errors).length, 7);
});

test('validateAllFields passes with valid Aadhaar or PAN last 6 entry', () => {
  const validAadhaar = {
    name: 'Rohan Verma',
    stageName: 'B-Boy Vex',
    age: '22',
    city: 'Delhi',
    contactNumber: '9876543210',
    idLast6: '482910',
    acceptedRules: true,
  };
  assert.deepEqual(validateAllFields(validAadhaar), {});

  const validPan = {
    ...validAadhaar,
    idLast6: 'E1234F',
  };
  assert.deepEqual(validateAllFields(validPan), {});
});

test('validateField enforces age bounds and Indian mobile rules', () => {
  assert.ok(validateField('age', { ...INITIAL_FORM_VALUES, age: '11' }));
  assert.equal(validateField('age', { ...INITIAL_FORM_VALUES, age: '12' }), undefined);
  assert.equal(validateField('age', { ...INITIAL_FORM_VALUES, age: '65' }), undefined);
  assert.ok(validateField('age', { ...INITIAL_FORM_VALUES, age: '66' }));

  assert.ok(validateField('contactNumber', { ...INITIAL_FORM_VALUES, contactNumber: '5123456789' }));
  assert.equal(validateField('contactNumber', { ...INITIAL_FORM_VALUES, contactNumber: '6123456789' }), undefined);
});

test('generateRegistrationId uses ORG27 prefix with 4 safe chars', () => {
  const id = generateRegistrationId();
  assert.match(id, /^ORG27-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/);
});
