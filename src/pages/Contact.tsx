import React from 'react';
import { Contact as ContactComponent } from '../components/Contact';
import { PageTransition } from '../components/PageTransition';

export function Contact() {
  return (
    <PageTransition>
      <main className="pt-16">
        <ContactComponent />
      </main>
    </PageTransition>
  );
}
