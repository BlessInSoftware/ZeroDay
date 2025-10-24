import { Temporal } from '@js-temporal/polyfill';

export interface Incident {
  id: number;
  title: string;
  description: string;
  history: Temporal.Instant[];
}
