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
    <div className='bg-white p-4 rounded-lg shadow-sm border'>
      <h3 className='font-semibold text-black'>{incident.title}</h3>
      <p className='text-sm text-gray-600 mt-1'>{incident.description}</p>
      <span className='text-xs text-red-600 mt-2 block'>{formattedDate}</span>
    </div>
  );
}
