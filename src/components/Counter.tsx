"use client";

import { useEffect, useState } from "react";

export function Counter() {
  const [daysWithoutIncidents, setDaysWithoutIncidents] = useState<number>(0);

  useEffect(() => {
    // Only using this to save the date of the last incident in localStorage
    const lastIncident = localStorage.getItem("lastIncidentDate");
    if (lastIncident) {
      const diff =
        (Date.now() - new Date(lastIncident).getTime()) / (1000 * 60 * 60 * 24);
      setDaysWithoutIncidents(Math.floor(diff));
    } else {
      setDaysWithoutIncidents(0);
    }
  }, []);

  const variantClass =
    daysWithoutIncidents === 0
      ? "bg-red-600 text-white"
      : daysWithoutIncidents > 10
      ? "bg-green-600 text-white"
      : daysWithoutIncidents > 5
      ? "bg-yellow-400 text-black"
      : "bg-blue-600 text-white";

  return (
    <div className={`${variantClass} px-6 py-4 rounded-lg shadow-md text-center w-full max-w-sm`}>
      <span className="text-xs block">Days without incidents</span>
      <span className="text-3xl font-bold">{daysWithoutIncidents}</span>
    </div>
  );
}
