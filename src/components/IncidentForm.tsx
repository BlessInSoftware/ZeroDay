'use client';

import { useState } from 'react';
import { Incident } from '@/types/global';
import { Temporal } from '@js-temporal/polyfill';

interface Props {
  onAddIncident: (incident: Incident) => void;
}

export function IncidentForm({ onAddIncident }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newIncident: Incident = {
      id: Date.now(),
      title,
      description,
      history: [Temporal.Now.instant()],
    };

    onAddIncident(newIncident);

    // Save the date of the last incident in localStorage
    localStorage.setItem('lastIncidentDate', newIncident.history[0]?.toString());

    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className='bg-white p-4 rounded-lg shadow-md space-y-3'>
      <h2 className='text-lg font-semibold text-black'>Register New Incident</h2>
      <input
        type='text'
        placeholder='Incident Title'
        className='w-full p-2 border rounded text-black'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder='Description'
        className='w-full p-2 text-black border rounded resize-none'
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition'>
        Save
      </button>
    </form>
  );
}
