export async function fetchMetrics() {
  const response = await fetch("http://localhost/api/support/stats/last_month", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors", // Ensure this is set to "cors" for proper CORS handling
  });

  if (!response.ok) {
    throw new Error("Failed to fetch metrics");
  }
  type Stats = {
    new_this_month: number;
    perc_diff_new: number;
    resolved_this_month: number;
    perc_diff_resolved: number;
  }

  const response_dict: {
    status: string,
    stats: {
      help: Stats,
      reports: Stats
    }
  } = await response.json();
  return [
    {
      title: "[Help] Created Tickets",
      value: response_dict.stats.help.new_this_month.toString(),
      change: response_dict.stats.help.perc_diff_new,
    },
    {
      title: "[Help] Resolved Tickets",
      value: response_dict.stats.help.resolved_this_month.toString(),
      change: response_dict.stats.help.perc_diff_resolved,
    },
    {
      title: "[Report] Created Tickets",
      value: response_dict.stats.reports.new_this_month.toString(),
      change: response_dict.stats.reports.perc_diff_new,
    },
    {
      title: "[Report] Resolved Tickets",
      value: response_dict.stats.reports.resolved_this_month.toString(),
      change: response_dict.stats.reports.perc_diff_resolved,
    },
  ];
}