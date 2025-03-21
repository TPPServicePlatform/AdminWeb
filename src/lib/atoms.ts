import { addDays, endOfDay, startOfDay } from "date-fns";
import { atom } from "jotai";
import type { DateRange } from "react-day-picker";
import type { TicketMetric } from "@/types/types";

const defaultStartDate = new Date(2023, 11, 18);

export const dateRangeAtom = atom<DateRange | undefined>({
  from: defaultStartDate,
  to: addDays(defaultStartDate, 6),
});

const cache = new Map<string, TicketMetric[]>();

export const ticketChartDataAtom = atom<TicketMetric[]>([]);

export const fetchTicketChartDataAtom = atom(null, async (get, set) => {
  const dateRange = get(dateRangeAtom);

  if (!dateRange?.from || !dateRange?.to) {
    set(ticketChartDataAtom, []);
    return;
  }

  const startDate = startOfDay(dateRange.from);
  const endDate = endOfDay(dateRange.to);

  const formatter = (date: Date) => date.toISOString().split("T")[0];
  const cacheKey = `${formatter(startDate)}_${formatter(endDate)}`;

  if (cache.has(cacheKey)) {
    set(ticketChartDataAtom, cache.get(cacheKey)!);
    return;
  }

  const url = new URL("http://localhost/api/support/stats/by_day");
  url.searchParams.append("from_date", formatter(startDate));
  url.searchParams.append("to_date", formatter(endDate));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch ticket data");
  }

  const response_dict: {
    status: string;
    results: { [key: string]: { new: number; resolved: number } };
  } = await response.json();

  const data: { date: string; created: number; resolved: number }[] = [];
  for (const key in response_dict.results) {
    const result = response_dict.results[key];
    data.push({
      date: key,
      created: typeof result.new === "number" ? result.new : 0,
      resolved: typeof result.resolved === "number" ? result.resolved : 0,
    });
  }

  const result = data.flatMap((item: { date: string; created: number; resolved: number }) => {
    const res: TicketMetric[] = [
      {
        date: item.date,
        type: "resolved",
        count: item.resolved,
      },
      {
        date: item.date,
        type: "created",
        count: item.created,
      },
    ];
    return res;
  });

  cache.set(cacheKey, result);
  set(ticketChartDataAtom, result);
});
