"use client";

import { useEffect, useState } from "react";
import Container from "@/components/container";
import { fetchMetrics } from "@/data/metrics";
import MetricCard from "./components/metric-card";

export default function Metrics() {
  const [metrics, setMetrics] = useState<{ title: string; value: string; change: number; className?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await fetchMetrics();
        setMetrics(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container className="grid grid-cols-1 gap-y-6 border-b border-border py-4 phone:grid-cols-2 laptop:grid-cols-4">
      {
      metrics.map((metric: { title: string; value: string; change: number; className?: string }) => (
        <MetricCard key={metric.title} {...metric} />
      ))
      }
    </Container >
  );
}
