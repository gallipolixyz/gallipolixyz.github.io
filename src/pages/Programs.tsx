import React from 'react';
import { Programs as ProgramsComponent } from '../components/Programs';
import { PageTransition } from '../components/PageTransition';

export function Programs() {
  return (
    <PageTransition>
      <main className="pt-16">
        <ProgramsComponent />
      </main>
    </PageTransition>
  );
}