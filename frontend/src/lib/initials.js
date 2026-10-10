export function initialsOf(name, email) {
  const source = (name || "").trim() || (email || "").trim();
  if (!source) return "?";
  const parts = source.includes("@") ? [source[0]] : source.split(/\s+/);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}
