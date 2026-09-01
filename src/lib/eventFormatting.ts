export function formatEventDate(
  dateString: string,
  language: string,
  withTime = false,
): string {
  return new Date(dateString).toLocaleDateString(language === "en" ? "en-US" : "ar-SA", {
    year: "numeric",
    month: language === "en" ? "short" : "long",
    day: "numeric",
    ...(withTime ? { hour: "2-digit" as const, minute: "2-digit" as const } : {}),
  });
}

export function isEventPast(dateString: string): boolean {
  return new Date(dateString) < new Date();
}

export function getCapacityRatio(
  registrationCount: number | undefined,
  maxAttendees: number,
): number | null {
  if (registrationCount === undefined) return null;
  return Math.min(100, Math.round((registrationCount / maxAttendees) * 100));
}
