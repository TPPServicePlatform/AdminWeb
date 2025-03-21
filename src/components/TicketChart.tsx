import React, { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { dateRangeAtom, ticketChartDataAtom, fetchTicketChartDataAtom } from "@/lib/atoms";

const TicketChart = () => {
  const dateRange = useAtomValue(dateRangeAtom);
  const ticketChartData = useAtomValue(ticketChartDataAtom);
  const fetchTicketChartData = useSetAtom(fetchTicketChartDataAtom);

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      fetchTicketChartData();
    }
  }, [dateRange, fetchTicketChartData]);

  return (
    <div>
      <h1>Ticket Chart</h1>
      <ul>
        {ticketChartData.map((metric, index) => (
          <li key={index}>
            {metric.date} - {metric.type}: {metric.count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketChart;
