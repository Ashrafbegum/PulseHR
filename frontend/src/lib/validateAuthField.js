const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function validateAuthField(name, value) {
  const text = String(value ?? "").trim();
  if (!text) return "This field is required.";
  if (name === "email" && !emailPattern.test(text)) return "Enter a valid email address.";
  if (name === "password" && text.length < 8) return "Use at least 8 characters.";
  if (name === "phone" && !/^[+\d().\s-]{7,20}$/.test(text)) return "Enter a valid phone number.";
  return "";
}
