import React from 'react';
import { Events as EventsComponent } from '../components/Events';
import { PageTransition } from '../components/PageTransition';

export function Events() {
  return (
    <PageTransition>
      <main className="pt-16">
        <EventsComponent />
      </main>
    </PageTransition>
  );
} 