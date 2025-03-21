export async function fetchStatus() {
  const response = await fetch("http://localhost/api/services/stats/by_status/last_month",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors", // Ensure this is set to "cors" for proper CORS handling
    });

  if (!response.ok) {
    throw new Error("Failed to fetch status data");
  }

  const result_dict = await response.json();
  const results: { name: string, value: number }[] = [];
  const data = result_dict["results"] || {}; // Handle missing or empty "results"
  for (const key in data) {
    results.push({ name: key, value: data[key] });
  }
  return results;
}