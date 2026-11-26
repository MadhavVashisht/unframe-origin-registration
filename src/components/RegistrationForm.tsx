import { useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Loader2,
  Shield,
} from 'lucide-react';
import type {
  RegistrationErrors,
  RegistrationField,
  RegistrationFormValues,
  SubmissionResult,
} from '../types/registration';
import {
  detectIdFormat,
  FIELD_INPUT_IDS,
  FIELD_LABELS,
  FIELD_ORDER,
  INITIAL_FORM_VALUES,
  normalizeIdLast6Input,
  normalizePhoneInput,
  validateAllFields,
  validateField,
} from '../utils/validation';
import { submitRegistration } from '../services/registrationService';

const CITY_SUGGESTIONS = ['Delhi', 'New Delhi', 'Noida', 'Gurugram', 'Faridabad', 'Ghaziabad', 'Mumbai', 'Bengaluru'];

interface RegistrationFormProps {
  onSuccess: (result: SubmissionResult) => void;
}

export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [values, setValues] = useState<RegistrationFormValues>(INITIAL_FORM_VALUES);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [touched, setTouched] = useState<Partial<Record<RegistrationField, boolean>>>({});
  const [showErrorSummary, setShowErrorSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const idFormat = useMemo(() => detectIdFormat(values.idLast6), [values.idLast6]);

  const errorList = useMemo(
    () =>
      FIELD_ORDER.filter((field) => Boolean(errors[field])).map((field) => ({
        field,
        inputId: FIELD_INPUT_IDS[field],
        label: FIELD_LABELS[field],
        message: errors[field] as string,
      })),
    [errors]
  );

  function updateField<K extends RegistrationField>(
    field: K,
    nextValue: RegistrationFormValues[K]
  ) {
    const nextValues = { ...values, [field]: nextValue };
    setValues(nextValues);
    setSubmitError(null);

    if (touched[field] || errors[field]) {
      const fieldError = validateField(field, nextValues);
      setErrors((prev) => {
        const updated = { ...prev };
        if (fieldError) {
          updated[field] = fieldError;
        } else {
          delete updated[field];
        }
        return updated;
      });
    }
  }

  function handleBlur(field: RegistrationField) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validateField(field, values);
    setErrors((prev) => {
      const updated = { ...prev };
      if (fieldError) {
        updated[field] = fieldError;
      } else {
        delete updated[field];
      }
      return updated;
    });
  }

  function focusFieldById(inputId: string) {
    const el = document.getElementById(inputId);
    if (el) {
      el.focus();
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const validationErrors = validateAllFields(values);
    const allTouched: Partial<Record<RegistrationField, boolean>> = {};
    for (const field of FIELD_ORDER) {
      allTouched[field] = true;
    }
    setTouched(allTouched);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setShowErrorSummary(true);
      requestAnimationFrame(() => {
        errorSummaryRef.current?.focus();
      });
      return;
    }

    setShowErrorSummary(false);
    setIsSubmitting(true);

    try {
      const result = await submitRegistration(values);
      onSuccess(result);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Could not submit your registration. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby="form-heading"
      className="no-print flex h-full flex-col border border-white/15 bg-[#0e0e13]/82 shadow-[0_28px_75px_rgba(0,0,0,0.88),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md"
    >
      {/* Form Header */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#14141b]/80 px-5 py-3.5 sm:px-6">
        <div>
          <p className="font-mono-tabular text-[10px] font-semibold tracking-[0.22em] text-[#a1a1aa] uppercase">
            STEP 01 / ATHLETE ENTRY
          </p>
          <h2
            id="form-heading"
            className="font-display text-2xl tracking-wide text-[#fafafa] uppercase sm:text-3xl"
          >
            DANCER REGISTRATION
          </h2>
        </div>
      </div>

      {/* Form Body */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex min-h-0 flex-1 flex-col justify-between gap-3 overflow-y-auto p-5 sm:p-6"
      >
        <div className="space-y-3.5">
          {/* Compact Focusable Validation Summary */}
          {showErrorSummary && errorList.length > 0 && (
            <div
              ref={errorSummaryRef}
              role="alert"
              tabIndex={-1}
              aria-labelledby="error-summary-title"
              className="border border-[#ef4444]/60 bg-[#241013] px-3.5 py-2.5 focus-visible:outline-2 focus-visible:outline-[#fca5a5]"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#fca5a5]"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1 text-xs text-[#fecaca]">
                  <p id="error-summary-title" className="font-bold">
                    Check {errorList.length} highlighted{' '}
                    {errorList.length === 1 ? 'field' : 'fields'}:{' '}
                    {errorList.map((item, idx) => (
                      <span key={item.field}>
                        {idx > 0 && ', '}
                        <a
                          href={`#${item.inputId}`}
                          onClick={(e) => {
                            e.preventDefault();
                            focusFieldById(item.inputId);
                          }}
                          className="underline decoration-[#fca5a5]/70 underline-offset-2 hover:text-white"
                        >
                          {item.label}
                        </a>
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Network / Sheet Submission Error */}
          {submitError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 border border-[#ef4444]/60 bg-[#241013] px-3.5 py-2.5 text-xs text-[#fecaca]"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-[#fca5a5]"
                aria-hidden="true"
              />
              <div>
                <span className="font-bold">Submission failed: </span>
                <span>{submitError}</span>
              </div>
            </div>
          )}

          {/* Row 1: NAME & STAGE NAME */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label
                htmlFor={FIELD_INPUT_IDS.name}
                className="font-mono-tabular block text-[11px] font-semibold tracking-[0.16em] text-[#fafafa] uppercase"
              >
                NAME <span className="text-[#facc15]">*</span>
              </label>
              <input
                id={FIELD_INPUT_IDS.name}
                name="name"
                type="text"
                autoComplete="name"
                required
                value={values.name}
                onChange={(e) => updateField('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="Full legal name (as on ID)"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'reg-name-error' : undefined}
                className={`mt-1.5 block min-h-[44px] w-full border bg-[#18181d] px-3.5 py-2 text-sm text-[#fafafa] placeholder:text-[#71717a] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#facc15] ${
                  errors.name
                    ? 'border-[#ef4444]'
                    : 'border-[#3f3f4a] hover:border-[#52525b]'
                }`}
              />
              {errors.name && (
                <p
                  id="reg-name-error"
                  role="alert"
                  className="mt-1 text-[11px] font-medium text-[#fca5a5]"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={FIELD_INPUT_IDS.stageName}
                className="font-mono-tabular block text-[11px] font-semibold tracking-[0.16em] text-[#fafafa] uppercase"
              >
                STAGE NAME <span className="text-[#facc15]">*</span>
              </label>
              <input
                id={FIELD_INPUT_IDS.stageName}
                name="stageName"
                type="text"
                autoComplete="nickname"
                required
                value={values.stageName}
                onChange={(e) => updateField('stageName', e.target.value)}
                onBlur={() => handleBlur('stageName')}
                placeholder="e.g. B-Boy Blaze / Kinetix"
                aria-invalid={Boolean(errors.stageName)}
                aria-describedby={errors.stageName ? 'reg-stage-error' : undefined}
                className={`mt-1.5 block min-h-[44px] w-full border bg-[#18181d] px-3.5 py-2 text-sm text-[#fafafa] placeholder:text-[#71717a] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#facc15] ${
                  errors.stageName
                    ? 'border-[#ef4444]'
                    : 'border-[#3f3f4a] hover:border-[#52525b]'
                }`}
              />
              {errors.stageName && (
                <p
                  id="reg-stage-error"
                  role="alert"
                  className="mt-1 text-[11px] font-medium text-[#fca5a5]"
                >
                  {errors.stageName}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: AGE, CITY, CONTACT NUMBER */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-12">
            <div className="sm:col-span-3">
              <label
                htmlFor={FIELD_INPUT_IDS.age}
                className="font-mono-tabular block text-[11px] font-semibold tracking-[0.16em] text-[#fafafa] uppercase"
              >
                AGE <span className="text-[#facc15]">*</span>
              </label>
              <input
                id={FIELD_INPUT_IDS.age}
                name="age"
                type="text"
                inputMode="numeric"
                maxLength={2}
                required
                value={values.age}
                onChange={(e) =>
                  updateField('age', e.target.value.replace(/\D/g, '').slice(0, 2))
                }
                onBlur={() => handleBlur('age')}
                placeholder="12–65"
                aria-invalid={Boolean(errors.age)}
                aria-describedby={errors.age ? 'reg-age-error' : undefined}
                className={`font-mono-tabular mt-1.5 block min-h-[44px] w-full border bg-[#18181d] px-3.5 py-2 text-sm text-[#fafafa] placeholder:text-[#71717a] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#facc15] ${
                  errors.age
                    ? 'border-[#ef4444]'
                    : 'border-[#3f3f4a] hover:border-[#52525b]'
                }`}
              />
              {errors.age && (
                <p
                  id="reg-age-error"
                  role="alert"
                  className="mt-1 text-[11px] font-medium text-[#fca5a5]"
                >
                  {errors.age}
                </p>
              )}
            </div>

            <div className="sm:col-span-4">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor={FIELD_INPUT_IDS.city}
                  className="font-mono-tabular block text-[11px] font-semibold tracking-[0.16em] text-[#fafafa] uppercase"
                >
                  CITY <span className="text-[#facc15]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => updateField('city', 'Delhi')}
                  className="font-mono-tabular cursor-pointer text-[10px] font-semibold text-[#facc15] underline decoration-[#facc15]/50 underline-offset-2 hover:text-[#fde047] focus-visible:outline-2 focus-visible:outline-[#facc15]"
                >
                  Set Delhi
                </button>
              </div>
              <input
                id={FIELD_INPUT_IDS.city}
                name="city"
                type="text"
                list="origin-city-options"
                autoComplete="address-level2"
                required
                value={values.city}
                onChange={(e) => updateField('city', e.target.value)}
                onBlur={() => handleBlur('city')}
                placeholder="e.g. Delhi"
                aria-invalid={Boolean(errors.city)}
                aria-describedby={errors.city ? 'reg-city-error' : undefined}
                className={`mt-1.5 block min-h-[44px] w-full border bg-[#18181d] px-3.5 py-2 text-sm text-[#fafafa] placeholder:text-[#71717a] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#facc15] ${
                  errors.city
                    ? 'border-[#ef4444]'
                    : 'border-[#3f3f4a] hover:border-[#52525b]'
                }`}
              />
              <datalist id="origin-city-options">
                {CITY_SUGGESTIONS.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
              {errors.city && (
                <p
                  id="reg-city-error"
                  role="alert"
                  className="mt-1 text-[11px] font-medium text-[#fca5a5]"
                >
                  {errors.city}
                </p>
              )}
            </div>

            <div className="sm:col-span-5">
              <label
                htmlFor={FIELD_INPUT_IDS.contactNumber}
                className="font-mono-tabular block text-[11px] font-semibold tracking-[0.16em] text-[#fafafa] uppercase"
              >
                CONTACT NUMBER <span className="text-[#facc15]">*</span>
              </label>
              <div className="mt-1.5 flex">
                <span
                  className="font-mono-tabular inline-flex min-h-[44px] shrink-0 items-center border border-r-0 border-[#3f3f4a] bg-[#141419] px-3 text-xs font-semibold text-[#d4d4d8]"
                  aria-hidden="true"
                >
                  +91
                </span>
                <input
                  id={FIELD_INPUT_IDS.contactNumber}
                  name="contactNumber"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  required
                  value={values.contactNumber}
                  onChange={(e) =>
                    updateField('contactNumber', normalizePhoneInput(e.target.value))
                  }
                  onBlur={() => handleBlur('contactNumber')}
                  placeholder="9876543210"
                  aria-invalid={Boolean(errors.contactNumber)}
                  aria-describedby={errors.contactNumber ? 'reg-contact-error' : undefined}
                  className={`font-mono-tabular block min-h-[44px] w-full border bg-[#18181d] px-3.5 py-2 text-sm text-[#fafafa] placeholder:text-[#71717a] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#facc15] ${
                    errors.contactNumber
                      ? 'border-[#ef4444]'
                      : 'border-[#3f3f4a] hover:border-[#52525b]'
                  }`}
                />
              </div>
              {errors.contactNumber && (
                <p
                  id="reg-contact-error"
                  role="alert"
                  className="mt-1 text-[11px] font-medium text-[#fca5a5]"
                >
                  {errors.contactNumber}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: PAN OR ADHARCARD LAST 6 DIGIT */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor={FIELD_INPUT_IDS.idLast6}
                className="font-mono-tabular block text-[11px] font-semibold tracking-[0.16em] text-[#fafafa] uppercase"
              >
                PAN OR AADHAAR CARD (LAST 6 DIGITS / CHARS){' '}
                <span className="text-[#facc15]">*</span>
              </label>
              <div className="flex items-center gap-2">
                {idFormat && (
                  <span className="font-mono-tabular border border-[#facc15]/40 bg-[#facc15]/10 px-2 py-0.5 text-[10px] font-semibold text-[#fde047]">
                    {idFormat === 'AADHAAR'
                      ? 'AADHAAR FORMAT'
                      : idFormat === 'PAN'
                        ? 'PAN FORMAT'
                        : '6-CHAR ID'}
                  </span>
                )}
                <span className="font-mono-tabular text-[11px] text-[#a1a1aa]">
                  {values.idLast6.length}/6
                </span>
              </div>
            </div>

            <div className="relative mt-1.5">
              <input
                id={FIELD_INPUT_IDS.idLast6}
                name="idLast6"
                type="text"
                inputMode="text"
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                maxLength={6}
                required
                value={values.idLast6}
                onChange={(e) =>
                  updateField('idLast6', normalizeIdLast6Input(e.target.value))
                }
                onBlur={() => handleBlur('idLast6')}
                placeholder="482910 (Aadhaar last 6) or E1234F (PAN last 6)"
                aria-invalid={Boolean(errors.idLast6)}
                aria-describedby={
                  errors.idLast6 ? 'reg-id-hint reg-id-error' : 'reg-id-hint'
                }
                className={`font-mono-tabular block min-h-[44px] w-full border bg-[#18181d] px-3.5 py-2 pr-10 text-sm tracking-[0.2em] text-[#fafafa] uppercase placeholder:tracking-normal placeholder:normal-case placeholder:text-[#71717a] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#facc15] ${
                  errors.idLast6
                    ? 'border-[#ef4444]'
                    : 'border-[#3f3f4a] hover:border-[#52525b]'
                }`}
              />
              <Shield
                className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#a1a1aa]"
                aria-hidden="true"
              />
            </div>

            <p id="reg-id-hint" className="mt-1 text-[11px] text-[#a1a1aa]">
              Only the last 6 digits/characters are collected for on-site Delhi battle check-in.
            </p>
            {errors.idLast6 && (
              <p
                id="reg-id-error"
                role="alert"
                className="mt-1 text-[11px] font-medium text-[#fca5a5]"
              >
                {errors.idLast6}
              </p>
            )}
          </div>

          {/* Row 4: RULES & ELIGIBILITY CHECKBOX */}
          <div>
            <label
              htmlFor={FIELD_INPUT_IDS.acceptedRules}
              className={`flex min-h-[46px] cursor-pointer items-start gap-3 border px-3.5 py-2.5 transition-colors duration-150 ${
                errors.acceptedRules
                  ? 'border-[#ef4444] bg-[#241013]/60'
                  : values.acceptedRules
                    ? 'border-[#facc15]/60 bg-[#1c1a10]'
                    : 'border-[#2e2e38] bg-[#16161b] hover:border-[#52525b]'
              }`}
            >
              <span className="relative mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center">
                <input
                  id={FIELD_INPUT_IDS.acceptedRules}
                  name="acceptedRules"
                  type="checkbox"
                  checked={values.acceptedRules}
                  onChange={(e) => updateField('acceptedRules', e.target.checked)}
                  onBlur={() => handleBlur('acceptedRules')}
                  aria-invalid={Boolean(errors.acceptedRules)}
                  aria-describedby={errors.acceptedRules ? 'reg-rules-error' : undefined}
                  className="peer h-4.5 w-4.5 cursor-pointer appearance-none border border-[#71717a] bg-[#0c0c10] transition-colors checked:border-[#facc15] checked:bg-[#facc15] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#facc15]"
                />
                <Check
                  className="pointer-events-none absolute h-3 w-3 text-[#08080a] opacity-0 peer-checked:opacity-100"
                  strokeWidth={3}
                  aria-hidden="true"
                />
              </span>
              <span className="text-xs leading-snug text-[#d4d4d8]">
                I confirm my details match my physical PAN or Aadhaar card for Delhi check-in on{' '}
                <strong className="font-semibold text-[#fafafa]">17 Jan 2027</strong> and agree to{' '}
                <strong className="font-semibold text-[#fafafa]">UNFRAME EVENTS</strong> battle rules.
              </span>
            </label>
            {errors.acceptedRules && (
              <p
                id="reg-rules-error"
                role="alert"
                className="mt-1 text-[11px] font-medium text-[#fca5a5]"
              >
                {errors.acceptedRules}
              </p>
            )}
          </div>
        </div>

        {/* SUBMIT CTA */}
        <div className="border-t border-white/10 pt-3.5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-3 bg-[#facc15] px-6 py-3 text-xs font-bold tracking-[0.16em] text-[#08080a] uppercase shadow-[0_5px_0_#a16207,0_14px_28px_rgba(250,204,21,0.22)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#fde047] hover:shadow-[0_7px_0_#a16207,0_18px_32px_rgba(250,204,21,0.3)] active:translate-y-1 active:shadow-[0_1px_0_#a16207] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fafafa] sm:text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>SYNCING REGISTRATION...</span>
              </>
            ) : (
              <>
                <span>LOCK IN YOUR SPOT — REGISTER NOW</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#a1a1aa]">
            <span>Instant digital battle pass issued upon submission.</span>
            <span className="font-mono-tabular">UNFRAME EVENTS &bull; DELHI</span>
          </div>
        </div>
      </form>
    </section>
  );
}
