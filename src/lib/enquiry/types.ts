/** Wire types for POST /api/enquiry, shared by the form and the route. */

export const ENQUIRY_LIMITS = { name: 100, contact: 120, organisation: 120, message: 1500, minMessage: 10 } as const;

export type EnquiryRequest = {
  project: string;
  name: string;
  /** an email address or a phone number */
  contact: string;
  organisation?: string;
  /** index into asksFor(project) */
  interest: number;
  message: string;
  /** confirms the sender is 18 or older (Aram 4: no children's data) */
  adult: boolean;
  consent: boolean;
  lang: "ta" | "en" | "both";
  /** honeypot — real people leave it empty */
  website?: string;
};

export type EnquiryErrorCode = "bad_request" | "rate_limited" | "unconfigured" | "upstream";

export type EnquiryResponse =
  | { ok: true; reference: string }
  | { ok: false; error: { code: EnquiryErrorCode; field?: keyof EnquiryRequest; message: string } };

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** 8–15 digits once spaces, dashes, brackets and a leading + are dropped */
export const PHONE_RE = /^\+?[\d\s\-()]{8,20}$/;

export function validContact(v: string): boolean {
  const s = v.trim();
  if (EMAIL_RE.test(s)) return true;
  const digits = s.replace(/\D/g, "");
  return PHONE_RE.test(s) && digits.length >= 8 && digits.length <= 15;
}
