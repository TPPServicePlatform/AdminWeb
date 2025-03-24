import Container from "@/components/container";
import { TopNav } from "@/components/nav";

export default function TicketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav title="Ticket" />
      <main className="h-screen flex flex-col justify-end">
        <Container className="flex-end">{children}</Container>
      </main>
    </>
  );
}
