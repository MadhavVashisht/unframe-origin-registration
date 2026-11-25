import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildRegistrationPayload,
  EVENT_METADATA,
  isValidEndpointUrl,
  resolveRegistrationEndpoint,
  submitRegistration,
} from '../src/services/registrationService.ts';

const SAMPLE_VALUES = {
  name: '  Aarav   Sharma  ',
  stageName: '  B-Boy   Blaze ',
  age: '23',
  city: ' New   Delhi ',
  contactNumber: '+91 98765 43210',
  idLast6: 'e1234f',
  acceptedRules: true,
};

test('isValidEndpointUrl accepts https, localhost http, and relative /api routes', () => {
  assert.equal(isValidEndpointUrl('https://script.google.com/macros/s/abc/exec'), true);
  assert.equal(isValidEndpointUrl('/api/register'), true);
  assert.equal(isValidEndpointUrl('//evil.com/hook'), false);
  assert.equal(isValidEndpointUrl('http://localhost:3000/webhook'), true);
  assert.equal(isValidEndpointUrl('http://example.com/hook'), false);
  assert.equal(isValidEndpointUrl('javascript:alert(1)'), false);
});

test('resolveRegistrationEndpoint prioritizes VITE_API_ENDPOINT over VITE_WEBHOOK_URL', () => {
  assert.deepEqual(
    resolveRegistrationEndpoint({
      VITE_API_ENDPOINT: '/api/register',
      VITE_WEBHOOK_URL: 'https://script.google.com/macros/s/abc/exec',
    }),
    { url: '/api/register', mode: 'api' }
  );

  assert.deepEqual(
    resolveRegistrationEndpoint({
      VITE_WEBHOOK_URL: 'https://script.google.com/macros/s/abc/exec',
    }),
    { url: 'https://script.google.com/macros/s/abc/exec', mode: 'google-sheets' }
  );

  assert.equal(resolveRegistrationEndpoint({}), null);
});

test('buildRegistrationPayload normalizes fields and sets exact event metadata', () => {
  const payload = buildRegistrationPayload(SAMPLE_VALUES);

  assert.equal(payload.presenter, EVENT_METADATA.presenter);
  assert.equal(payload.event, EVENT_METADATA.event);
  assert.equal(payload.battleDate, EVENT_METADATA.battleDateIso);
  assert.equal(payload.eventCity, EVENT_METADATA.eventCity);
  assert.equal(payload.name, 'Aarav Sharma');
  assert.equal(payload.stageName, 'B-Boy Blaze');
  assert.equal(payload.age, 23);
  assert.equal(payload.city, 'New Delhi');
  assert.equal(payload.contactNumber, '9876543210');
  assert.equal(payload.idLast6, 'E1234F');
  assert.equal(payload.idFormatHint, 'PAN');
  assert.equal(payload.acceptedRules, true);
  assert.match(payload.registrationId, /^ORG27-/);
});

test('submitRegistration throws clear error when Google Sheets endpoint is not set', async () => {
  await assert.rejects(
    () => submitRegistration(SAMPLE_VALUES, null),
    /Google Sheets endpoint is not configured/i
  );
});

test('submitRegistration posts text/plain to Google Apps Script and succeeds', async () => {
  const originalFetch = globalThis.fetch;
  let capturedInit: RequestInit | undefined;

  globalThis.fetch = (async (_url, init) => {
    capturedInit = init;
    return new Response(JSON.stringify({ status: 'success', registrationId: 'ORG27-TEST' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;

  try {
    const result = await submitRegistration(SAMPLE_VALUES, {
      url: 'https://script.google.com/macros/s/test/exec',
      mode: 'google-sheets',
    });

    assert.equal(result.mode, 'google-sheets');
    assert.equal(
      (capturedInit?.headers as Record<string, string>)['Content-Type'],
      'text/plain;charset=utf-8'
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('submitRegistration surfaces Google Sheets error messages cleanly', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ status: 'error', error: 'Unauthorized webhook token.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })) as typeof fetch;

  try {
    await assert.rejects(
      () =>
        submitRegistration(SAMPLE_VALUES, {
          url: 'https://script.google.com/macros/s/test/exec',
          mode: 'google-sheets',
        }),
      /Unauthorized webhook token/i
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
