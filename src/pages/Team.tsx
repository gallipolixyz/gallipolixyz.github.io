import React from 'react';
import { CoreTeam } from '../components/CoreTeam';
import { PageTransition } from '../components/PageTransition';

export function Team() {
  return (
    <PageTransition>
      <main className="pt-16">
        <CoreTeam />
      </main>
    </PageTransition>
  );
}