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
      positive: Math.round((results.positive / totalReviews) * 100) / 100,
      neutral: Math.round((results.neutral / totalReviews) * 100) / 100,
      negative: Math.round((results.negative / totalReviews) * 100) / 100,
    },
    totalReviews: totalReviews,
  };
}
