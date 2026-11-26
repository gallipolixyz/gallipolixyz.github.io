import { Programs as ProgramsComponent } from '../components/Programs';
import { Career as CareerComponent } from '../components/Career';
import { PageTransition } from '../components/PageTransition';

export function Programs() {
  return (
    <PageTransition>
      <main className="pt-16">
        <ProgramsComponent />
        <section id="career" className="scroll-mt-24">
          <CareerComponent />
        </section>
      </main>
    </PageTransition>
  );
}
