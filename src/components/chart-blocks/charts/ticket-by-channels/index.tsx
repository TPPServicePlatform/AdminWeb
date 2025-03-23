import { Rss } from "lucide-react";
import ChartTitle from "../../components/chart-title";
import Chart from "./chart";

export default function ServicesByCategory() {
  return (
    <section className="flex h-full flex-col gap-2">
      <ChartTitle title="Services By Category" icon={Rss} />
      <div className="relative flex min-h-64 flex-grow flex-col justify-center">
        <Chart />
      </div>
    </section>
  );
}
