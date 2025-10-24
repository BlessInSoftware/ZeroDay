import { Incident } from '@/types/global';
import { Temporal } from '@js-temporal/polyfill';

export const mockIncidents: Incident[] = [
  {
    id: 1,
    title: 'Main Server Failure',
    description: 'Server stopped responding for 10 minutes.',
    history: [Temporal.Instant.from('2025-10-01T14:20:00Z')],
  },
  {
    id: 2,
    title: 'Form Validation Error',
    description: 'Email field was not accepting certain valid domains.',
    history: [Temporal.Instant.from('2025-10-02T14:20:00Z'), Temporal.Instant.from('2025-09-15T09:30:00Z')],
  },
  {
    id: 4,
    title: 'Form Validation Error',
    description: 'Email field was not accepting certain valid domains.',
    history: [
      Temporal.Instant.from('2025-10-03T14:20:00Z'),
      Temporal.Instant.from('2025-09-15T09:30:00Z'),
      Temporal.Instant.from('2025-09-12T08:15:00Z'),
    ],
  },
];
