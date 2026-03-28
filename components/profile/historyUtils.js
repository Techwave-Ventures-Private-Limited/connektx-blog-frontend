export function formatDateRange(startDate, endDate, current) {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  const startLabel = start
    ? start.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "";
  const endLabel = current
    ? "Present"
    : end
    ? end.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "";
  if (!startLabel && !endLabel) return "";
  return `${startLabel}${startLabel && endLabel ? " • " : ""}${endLabel}`;
}
