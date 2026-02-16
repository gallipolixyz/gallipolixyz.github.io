import React from 'react';
import { Career as CareerComponent } from '../components/Career';
import { PageTransition } from '../components/PageTransition';

export function Career() {
  return (
    <PageTransition>
      <main className="pt-16">
        <CareerComponent />
      </main>
    </PageTransition>
  );
}