import type {
  RegistrationFormValues,
  RegistrationPayload,
  SubmissionResult,
} from '../types/registration';
import {
  collapseSpaces,
  detectIdFormat,
  generateRegistrationId,
  normalizeIdLast6Input,
  normalizePhoneInput,
} from '../utils/validation.ts';

const REQUEST_TIMEOUT_MS = 15000;

export const EVENT_METADATA = {
  presenter: 'UNFRAME EVENTS',
  event: 'ORIGIN (REP YOUR STYLE)',
  battleDate: '17 JANUARY 2027',
  battleDateIso: '2027-01-17',
  eventCity: 'DELHI',
  winnerPrize: '₹15,000/-',
  runnerUpPrize: '₹10,000/-',
} as const;

export function isValidEndpointUrl(url: string): boolean {
  const clean = url.trim();
  if (!clean) {
    return false;
  }
  if (clean.startsWith('/')) {
    return !clean.startsWith('//');
  }
  try {
    const parsed = new URL(clean);
    if (parsed.protocol === 'https:') {
      return true;
    }
    return (
      parsed.protocol === 'http:' &&
      (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')
    );
  } catch {
    return false;
  }
}

export interface EndpointConfig {
  url: string;
  mode: 'google-sheets' | 'api';
}

export function resolveRegistrationEndpoint(overrideEnv?: {
  VITE_API_ENDPOINT?: string;
  VITE_WEBHOOK_URL?: string;
}): EndpointConfig | null {
  const apiEndpoint =
    overrideEnv?.VITE_API_ENDPOINT ?? import.meta.env?.VITE_API_ENDPOINT;
  if (typeof apiEndpoint === 'string' && isValidEndpointUrl(apiEndpoint)) {
    return { url: apiEndpoint.trim(), mode: 'api' };
  }

  const webhookUrl =
    overrideEnv?.VITE_WEBHOOK_URL ?? import.meta.env?.VITE_WEBHOOK_URL;
  if (typeof webhookUrl === 'string' && isValidEndpointUrl(webhookUrl)) {
    const trimmed = webhookUrl.trim();
    const isGoogleScript =
      !trimmed.startsWith('/') && new URL(trimmed).hostname === 'script.google.com';
    return {
      url: trimmed,
      mode: isGoogleScript ? 'google-sheets' : 'api',
    };
  }

  return null;
}

export function isRegistrationBackendConfigured(): boolean {
  return resolveRegistrationEndpoint() !== null;
}

export function buildRegistrationPayload(
  values: RegistrationFormValues,
  includeClientToken = true
): RegistrationPayload {
  const idLast6 = normalizeIdLast6Input(values.idLast6);
  const envToken = import.meta.env?.VITE_WEBHOOK_TOKEN;
  const token =
    includeClientToken && typeof envToken === 'string' && envToken.trim()
      ? envToken.trim()
      : undefined;

  return {
    registrationId: generateRegistrationId(),
    event: EVENT_METADATA.event,
    presenter: EVENT_METADATA.presenter,
    battleDate: EVENT_METADATA.battleDateIso,
    eventCity: EVENT_METADATA.eventCity,
    name: collapseSpaces(values.name),
    stageName: collapseSpaces(values.stageName),
    age: Number.parseInt(values.age.trim(), 10),
    city: collapseSpaces(values.city),
    contactNumber: normalizePhoneInput(values.contactNumber),
    idLast6,
    idFormatHint: detectIdFormat(idLast6) ?? 'ALPHANUMERIC',
    acceptedRules: values.acceptedRules,
    submittedAt: new Date().toISOString(),
    ...(token ? { webhookToken: token } : {}),
  };
}

export async function submitRegistration(
  values: RegistrationFormValues,
  endpointOverride?: EndpointConfig | null
): Promise<SubmissionResult> {
  const endpoint =
    endpointOverride === undefined ? resolveRegistrationEndpoint() : endpointOverride;

  if (!endpoint) {
    throw new Error(
      'Google Sheets endpoint is not configured yet. Set VITE_WEBHOOK_URL or VITE_API_ENDPOINT in your .env file.'
    );
  }

  const isAppsScript =
    !endpoint.url.startsWith('/') &&
    new URL(endpoint.url).hostname === 'script.google.com';
  const payload = buildRegistrationPayload(values, !endpoint.url.startsWith('/'));

  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    // Google Apps Script Web Apps reject CORS preflight OPTIONS requests when Content-Type is
    // application/json; sending text/plain avoids preflight while still delivering JSON text.
    const response = await fetch(endpoint.url, {
      method: 'POST',
      headers: {
        'Content-Type': isAppsScript ? 'text/plain;charset=utf-8' : 'application/json',
      },
      redirect: 'follow',
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const rawText = await response.text();
    let parsed: { status?: string; message?: string; error?: string } | null = null;
    if (rawText) {
      try {
        parsed = JSON.parse(rawText) as {
          status?: string;
          message?: string;
          error?: string;
        };
      } catch {
        // Non-JSON response body
      }
    }

    if (!response.ok) {
      throw new Error(
        parsed?.error ||
          parsed?.message ||
          `Registration server returned HTTP ${response.status}.`
      );
    }

    if (parsed?.status === 'error') {
      throw new Error(
        parsed.error || parsed.message || 'Google Sheets rejected the submission.'
      );
    }

    return {
      mode: endpoint.mode,
      registration: payload,
      message: 'Your registration is synced to the official ORIGIN battle sheet.',
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out. Check your internet connection and retry.');
    }
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Unable to submit registration right now. Please try again.');
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}
