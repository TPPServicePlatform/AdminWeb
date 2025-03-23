"use client";

import { CirclePercent } from "lucide-react";
import { fetchStatus } from "@/data/status";
import { addThousandsSeparator } from "@/lib/utils";
import ChartTitle from "../../components/chart-title";
import Chart from "./chart";
import { useEffect, useState } from "react";

export default function Status() {
  const [status, setStatus] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await fetchStatus();
        setStatus(data);
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, []);

  return (
    <section className="flex h-full flex-col gap-2">
      <ChartTitle title="Bookings Status Updates" icon={CirclePercent} />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Indicator status={status} />
          <div className="relative max-h-80 flex-grow">
            <Chart status={status} />
          </div>
        </>
      )}
    </section>
  );
}

function Indicator({ status: status }: { status: { name: string; value: number }[] }) {
  return (
    <div className="mt-3">
      <span className="mr-1 text-2xl font-medium">
        {addThousandsSeparator(
          status.reduce((acc, curr) => acc + curr.value, 0),
        )}
      </span>
      <span className="text-muted-foreground/60">Last 30 days</span>
    </div>
  );
}
