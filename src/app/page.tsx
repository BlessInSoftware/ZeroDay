"use client";

import { useState } from "react";
import { IncidentForm } from "@/components/IncidentForm";
import { IncidentCard } from "@/components/IncidentCard";
import { mockIncidents } from "@/lib/mockData";
import { Incident } from "@/types/incident";
import { Counter } from "@/components/Counter";

export default function HomePage() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);

  const handleAddIncident = (incident: Incident) => {
    setIncidents([incident, ...incidents]);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-center my-6">
        <Counter />
      </div>

      <IncidentForm onAddIncident={handleAddIncident} />
      <h2 className="text-lg font-semibold mt-8 mb-4 text-white">
        Incident History
      </h2>
      <div className="space-y-3">
        {incidents.length === 0 ? (
          <p className="text-gray-500">No incidents recorded.</p>
        ) : (
          incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))
        )}
      </div>
    </div>
  );
}
