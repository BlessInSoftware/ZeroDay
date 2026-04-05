'use client';

import { useState } from 'react';
import { IncidentForm } from '@/components/IncidentForm';
import { mockIncidents } from '@/lib/mockData';
import { Incident } from '@/types/global';
import { Counter } from '@/components/Counter';

export default function HomePage() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);

  const handleAddIncident = (incident: Incident) => {
    setIncidents([incident, ...incidents]);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <IncidentForm onAddIncident={handleAddIncident} />
      <h2 className="mt-8 mb-4 text-lg font-semibold text-white">Incident History</h2>
      <div className="space-y-3">
        {incidents.length === 0 ? (
          <p className="text-gray-500">No incidents recorded.</p>
        ) : (
          incidents.map((incident) => <Counter key={incident.id} props={incident} />)
        )}
      </div>
    </div>
  );
}
