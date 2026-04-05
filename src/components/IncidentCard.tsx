import { Incident } from '@/types/global';
interface Props {
  incident: Incident;
}

export function IncidentCard({ incident }: Props) {
  // Compute a deterministic date in DD-MM-YYYY using the ISO string to avoid hydration differences
  const isoDate = incident.history[0]?.toString().split('T')[0];
  const [year, month, day] = isoDate.split('-');
  const formattedDate = `${day}-${month}-${year}`;

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-black">{incident.title}</h3>
      <p className="mt-1 text-sm text-gray-600">{incident.description}</p>
      <span className="mt-2 block text-xs text-red-600">{formattedDate}</span>
    </div>
  );
}
