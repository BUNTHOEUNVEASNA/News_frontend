export function formatDate(date?: string | null): string {
  if (!date) return "Unknown date";

  const parsed = new Date(date);

  // If date is invalid, fallback
  if (isNaN(parsed.getTime())) return "Unknown date";

  return parsed.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
