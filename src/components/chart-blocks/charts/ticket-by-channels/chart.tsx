"use client";

import {
  type IPieChartSpec,
  VChart,
} from "@visactor/react-vchart";
import type { Datum } from "@visactor/vchart/esm/typings";
import { useEffect, useState } from "react";
import { addThousandsSeparator } from "@/lib/utils";

export default function Chart() {
  const [data, setData] = useState<{ type: string; value: number; realValue: number }[]>([]);
  const [totalServices, setTotalServices] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (typeof fetch !== "undefined") {
        const response = await fetch("http://localhost/api/services/stats/by_category", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors", // Ensure this is set to "cors" for proper CORS handling
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        if (result.status === "ok" && result.results) {
          const categoryCount = result.results;
          const processedData = (Object.entries(categoryCount) as [string, number][]).reduce(
            (acc: { type: string; value: number; realValue: number }[], [type, value]) => {
              acc.push({
                type,
                value: value,
                realValue: value,
              });
              return acc;
            },
            []
          );
          setData(processedData);
          setTotalServices(Object.values(categoryCount as Record<string, number>).reduce((acc, count) => acc + count, 0));
        }
      }
    }

    fetchData();
  }, []);

  const spec: IPieChartSpec = {
    type: "pie",
    legends: [
      {
        type: "discrete",
        visible: true,
        orient: "bottom",
      },
    ],
    data: [
      {
        id: "id0",
        values: data,
      },
    ],
    valueField: "value",
    categoryField: "type",
    outerRadius: 1,
    innerRadius: 0.88,
    startAngle: -180,
    padAngle: 0.6,
    endAngle: 0,
    centerY: "80%",
    layoutRadius: "auto",
    pie: {
      style: {
        cornerRadius: 6,
      },
    },
    tooltip: {
      trigger: ["click", "hover"],
      mark: {
        title: {
          visible: false,
        },
        content: [
          {
            key: (datum: Datum | undefined) => datum?.type,
            value: (datum: Datum | undefined) => datum?.realValue,
          },
        ],
      },
    },
    indicator: [
      {
        visible: true,
        offsetY: "40%",
        title: {
          style: {
            text: "Total Active Services",
            fontSize: 16,
            opacity: 0.6,
          },
        },
      },
      {
        visible: true,
        offsetY: "64%",
        title: {
          style: {
            text: addThousandsSeparator(totalServices),
            fontSize: 28,
          },
        },
      },
    ],
  };

  return <VChart spec={spec} />;
}
