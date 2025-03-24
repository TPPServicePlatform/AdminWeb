export async function fetchClientSatisfaction() {
  const response = await fetch('http://localhost/api/services/stats/by_rating', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors", // Ensure this is set to "cors" for proper CORS handling
  });
  if (!response.ok) {
    throw new Error('Failed to fetch client satisfaction data');
  }
  const data = await response.json();
  const results = data.results;
  const totalReviews = results.positive + results.neutral + results.negative;

  return {
    clientSatisfaction: {
      positive: parseFloat(((results.positive / totalReviews) * 100).toFixed(2)),
      neutral: parseFloat(((results.neutral / totalReviews) * 100).toFixed(2)),
      negative: parseFloat(((results.negative / totalReviews) * 100).toFixed(2)),
    },
    totalReviews: totalReviews,
  };
}
