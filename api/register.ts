/**
 * Same-origin serverless proxy for Vercel (eliminates Safari/browser cross-origin redirect issues
 * with Google Apps Script and keeps WEBHOOK_TOKEN server-side).
 *
 * Environment variables on Vercel:
 * - GOOGLE_SHEETS_WEBHOOK_URL = https://script.google.com/macros/s/.../exec
 * - WEBHOOK_TOKEN (optional, matching Apps Script Script Property WEBHOOK_TOKEN)
 */

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return jsonResponse(
      { status: 'error', error: 'Server missing GOOGLE_SHEETS_WEBHOOK_URL.' },
      500
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonResponse({ status: 'error', error: 'Invalid JSON request body.' }, 400);
  }

  const name = String(body.name ?? '').trim();
  const stageName = String(body.stageName ?? '').trim();
  const age = Number(body.age);
  const city = String(body.city ?? '').trim();
  const contactNumber = String(body.contactNumber ?? '').replace(/\D/g, '');
  const idLast6 = String(body.idLast6 ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  const acceptedRules = Boolean(body.acceptedRules);

  if (
    name.length < 2 ||
    stageName.length < 2 ||
    city.length < 2 ||
    !Number.isInteger(age) ||
    age < 12 ||
    age > 65 ||
    !/^[6-9]\d{9}$/.test(contactNumber) ||
    !/^[A-Z0-9]{6}$/.test(idLast6) ||
    !acceptedRules
  ) {
    return jsonResponse({ status: 'error', error: 'Validation failed.' }, 400);
  }

  const serverToken = process.env.WEBHOOK_TOKEN?.trim();
  const forwardPayload = {
    ...body,
    name,
    stageName,
    age,
    city,
    contactNumber,
    idLast6,
    acceptedRules,
    ...(serverToken ? { webhookToken: serverToken } : {}),
  };

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      redirect: 'follow',
      body: JSON.stringify(forwardPayload),
    });

    const text = await upstream.text();
    let parsed: { status?: string; error?: string; registrationId?: string } | null = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Upstream returned non-JSON
    }

    if (!upstream.ok || parsed?.status === 'error') {
      return jsonResponse(
        {
          status: 'error',
          error: parsed?.error || `Google Sheets upstream error (${upstream.status}).`,
        },
        502
      );
    }

    return jsonResponse({
      status: 'success',
      registrationId: parsed?.registrationId || body.registrationId,
    });
  } catch {
    return jsonResponse(
      { status: 'error', error: 'Failed to connect to Google Sheets upstream.' },
      502
    );
  }
}
