import React from 'react';
import { About as AboutComponent } from '../components/About';
import { PageTransition } from '../components/PageTransition';

export function About() {
  return (
    <PageTransition>
      <main className="pt-16">
        <AboutComponent />
      </main>
    </PageTransition>
  );
}