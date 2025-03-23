"use client";

import { useEffect, useState } from "react";
import { SmilePlus, ThumbsDown, ThumbsUp } from "lucide-react";
import { fetchClientSatisfaction } from "@/data/client-satisfaction";
import ChartTitle from "../../components/chart-title";
import LinearProgress from "./components/linear-progress";

export default function ClientSatisfaction() {
  const [data, setData] = useState({
    clientSatisfaction: { positive: 0, neutral: 0, negative: 0 },
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const fetchedData = await fetchClientSatisfaction();
        setData(fetchedData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const clientSatisfactionOptions = [
    {
      label: "Positive",
      color: "#5fb67a",
      percentage: data.clientSatisfaction.positive,
      icon: <ThumbsUp className="h-6 w-6" stroke="#5fb67a" fill="#5fb67a" />,
    },
    {
      label: "Neutral",
      color: "#f5c36e",
      percentage: data.clientSatisfaction.neutral,
      icon: <ThumbsUp className="h-6 w-6" stroke="#f5c36e" fill="#f5c36e" />,
    },
    {
      label: "Negative",
      color: "#da6d67",
      percentage: data.clientSatisfaction.negative,
      icon: <ThumbsDown className="h-6 w-6" stroke="#da6d67" fill="#da6d67" />,
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex h-full flex-col gap-2">
      <ChartTitle title="Client Satisfaction" icon={SmilePlus} />
      <div className="my-4 flex h-full items-center justify-between">
        <div className="mx-auto grid w-full grid-cols-2 gap-6">
          <TotalReviews total={data.totalReviews} />
          {clientSatisfactionOptions.map((option) => (
            <LinearProgress
              key={option.label}
              label={option.label}
              color={option.color}
              percentage={option.percentage}
              icon={option.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TotalReviews({ total }: { total: number }) {
  return (
    <div className="flex flex-col items-start justify-center">
      <div className="text-xs text-muted-foreground">Responses Received</div>
      <div className="text-2xl font-medium">{total} Reviews</div>
    </div>
  );
}
