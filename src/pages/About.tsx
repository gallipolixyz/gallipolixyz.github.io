import React from 'react';
import { About as AboutComponent } from '../components/About';
import { PageTransition } from '../components/PageTransition';
import { StoryTimeline } from '../components/StoryTimeline'; 

export function About() {
  return (
    <PageTransition>
      <main className="pt-16">
        {}
        <AboutComponent />
        
        {}
        <StoryTimeline />
      </main>
    </PageTransition>
  );
}