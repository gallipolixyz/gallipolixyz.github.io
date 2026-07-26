import React from 'react';
import { PageTransition } from '../components/PageTransition';
import { StoryTimeline } from '../components/StoryTimeline';

export function Timeline() {
  return (
    <PageTransition>
      <main className="pt-24 min-h-screen bg-black">
        {}
        <div className="max-w-4xl mx-auto px-4 text-center mt-10">
          <h1 className="text-5xl font-extrabold text-custom-cyan uppercase tracking-widest mb-4">
            Gallipoli History_
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Every step we have taken and every milestone we have achieved in the cybersecurity ecosystem—from day one to today.
          </p>
        </div>

        {}
        <StoryTimeline />
      </main>
    </PageTransition>
  );
}