import { partnership } from "@/content/skyfall";

export interface LeadFields {
  name: string;
  email: string;
  website: string;
  message: string;
}

export type LeadField = keyof LeadFields;
export type LeadErrors = Partial<Record<LeadField, string>>;

export const emptyLead: LeadFields = { name: "", email: "", website: "", message: "" };
export const maxWords = partnership.fields.message.maxWords;

export const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export function clampWords(text: string, limit: number) {
  const match = text.match(new RegExp(`^\\s*(?:\\S+\\s+){${limit - 1}}\\S+`));
  return countWords(text) > limit && match ? match[0] : text;
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/.test(value.trim());
}

export function isWebsite(value: string) {
  const trimmed = value.trim();
  if (!trimmed || /\s/.test(trimmed)) return false;
  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    return /^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i.test(url.hostname);
  } catch {
    return false;
  }
}

export function validateLead(fields: LeadFields): LeadErrors {
  const errors: LeadErrors = {};
  const { errors: copy } = partnership;
  if (!fields.name.trim()) errors.name = copy.required;
  if (!fields.email.trim()) errors.email = copy.required;
  else if (!isEmail(fields.email)) errors.email = copy.email;
  if (!fields.website.trim()) errors.website = copy.required;
  else if (!isWebsite(fields.website)) errors.website = copy.website;
  if (!fields.message.trim()) errors.message = copy.required;
  else if (countWords(fields.message) > maxWords) errors.message = copy.words;
  return errors;
}

export const errorText = "text-[13px] tracking-[-0.01em] text-[#C2362F]";

export const inputClass = (invalid: boolean) =>
  `mt-2 block w-full border bg-paper px-3.5 text-[16px] tracking-[-0.02em] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-brand focus:ring-1 focus:ring-brand ${invalid ? "border-[#C2362F]" : "border-ink/25 hover:border-ink/50"}`;

export async function submitLead(form: string, payload: Record<string, string>, honeypot: string) {
  await new Promise((resolve) => setTimeout(resolve, 900));
  if (honeypot) throw new Error("Rejected");
  return { ok: true, form, payload };
}
