import { formatInTimeZone } from "date-fns-tz";

// Single date/time/currency entry point. Components must not call
// date-fns `format` inline or hardcode date layouts — use these helpers.
export const DEFAULT_TIME_ZONE = "UTC";

export function getUserTimeZone(profile) {
  return profile?.timeZone || DEFAULT_TIME_ZONE;
}

// "11:01 am" — lowercase meridiem, colon separator.
export function formatTime(date, timeZone = DEFAULT_TIME_ZONE) {
  if (!date) return "";
  return formatInTimeZone(date, timeZone, "hh:mm a").toLowerCase();
}

export function formatDate(date, timeZone = DEFAULT_TIME_ZONE) {
  if (!date) return "";
  return formatInTimeZone(date, timeZone, "MMM d, yyyy");
}

export function formatDateTime(date, timeZone = DEFAULT_TIME_ZONE) {
  if (!date) return "";
  return `${formatDate(date, timeZone)} · ${formatTime(date, timeZone)}`;
}

export function formatCurrency(amount, currency = "USD", locale = "en-US") {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return "";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(amount));
}

export function formatNumber(value, locale = "en-US") {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "";
  return new Intl.NumberFormat(locale).format(Number(value));
}

export function formatHours(hours) {
  if (hours === null || hours === undefined || Number.isNaN(Number(hours))) return "";
  return `${Number(hours).toFixed(2)} hours`;
}
