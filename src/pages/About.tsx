import { About as AboutComponent, JoinUs } from '../components/About';
import { TimelineSection } from '../components/TimelineSection';
import { PageTransition } from '../components/PageTransition';

export function About() {
  return (
    <PageTransition>
      <main className="pt-16">
        <AboutComponent />
        <TimelineSection />
        <JoinUs />
      </main>
    </PageTransition>
  );
}
