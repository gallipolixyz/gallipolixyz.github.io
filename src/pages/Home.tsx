import React from 'react';
import { Hero } from '../components/Hero';
import { PageTransition } from '../components/PageTransition';

export function Home() {
  return (
    <PageTransition>
      <main className="pt-16">
        <Hero />
      </main>
    </PageTransition>
  );
}