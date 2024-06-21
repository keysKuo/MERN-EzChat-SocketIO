import React from "react";
import LineChart from "../components/Charts/LineChart";

export default function ChartPage() {
    const data = [
        { date: new Date(2023, 0, 1), value: 30 },
        { date: new Date(2023, 1, 1), value: 40 },
        { date: new Date(2023, 2, 1), value: 35 },
        { date: new Date(2023, 3, 1), value: 50 },
        { date: new Date(2023, 4, 1), value: 55 },
        { date: new Date(2023, 5, 1), value: 80 },
        { date: new Date(2023, 6, 1), value: 160 },
        { date: new Date(2023, 7, 1), value: 20 },
        { date: new Date(2023, 8, 1), value: 90 },
        { date: new Date(2023, 9, 1), value: 120 },
        { date: new Date(2023, 10, 1), value: 50 },
      ];

	return (
		<div className="flex sm:flex-row flex-col items-center justify-between h-[80svh] lg:w-[80%] w-[100%] mt-[4.5rem]">
            <LineChart data={data} />
        </div>
	);
}
