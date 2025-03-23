import {
  AverageTicketsCreated,
  Conversions,
  ClientSatisfaction,
  Metrics,
  ServicesByCategory,
} from "@/components/chart-blocks";
import Container from "@/components/container";

export default function Home() {
  return (
    <div>
      <Metrics />
      <div className="grid grid-cols-1 divide-y border-b border-border laptop:grid-cols-3 laptop:divide-x laptop:divide-y-0 laptop:divide-border">
        <Container className="py-4 laptop:col-span-2">
          <AverageTicketsCreated />
        </Container>
        <Container className="py-4 laptop:col-span-1">
          <Conversions />
        </Container>
      </div>
      <div className="grid grid-cols-1 divide-y border-b border-border laptop:grid-cols-2 laptop:divide-x laptop:divide-y-0 laptop:divide-border">
        <Container className="py-4 laptop:col-span-1">
          <ServicesByCategory />
        </Container>
        <Container className="py-4 laptop:col-span-1">
          <ClientSatisfaction />
        </Container>
      </div>
    </div>
  );
}
