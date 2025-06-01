import React from 'react';
import { BlogList as BlogsComponent } from '../components/Blogs';
import { PageTransition } from '../components/PageTransition';

export function Blogs() {
  return (
    <PageTransition>
      <main className="pt-16">
        <BlogsComponent />
      </main>
    </PageTransition>
  );
}