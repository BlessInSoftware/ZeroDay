import { Incident } from "@/types/incident";

export const mockIncidents: Incident[] = [
  {
    id: 1,
    title: "Main Server Failure",
    description: "Server stopped responding for 10 minutes.",
    date: new Date("2025-10-15"),
  },
  {
    id: 2,
    title: "Form Validation Error",
    description: "Email field was not accepting certain valid domains.",
    date: new Date("2025-10-20"),
  },
];
