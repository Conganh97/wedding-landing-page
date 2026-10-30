export type CalendarCell = {
  day: number;
  inMonth: boolean;
  isWeddingDay: boolean;
};

export function buildMonthCalendar(
  year: number,
  month: number,
  weddingDay: number,
): CalendarCell[] {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: CalendarCell[] = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: 0, inMonth: false, isWeddingDay: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      inMonth: true,
      isWeddingDay: d === weddingDay,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ day: 0, inMonth: false, isWeddingDay: false });
  }

  return cells;
}

export function googleCalendarUrl(params: {
  title: string;
  startIso: string;
  details?: string;
  location?: string;
}): string {
  const start = new Date(params.startIso);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: params.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: params.details ?? "",
    location: params.location ?? "",
  });

  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}
