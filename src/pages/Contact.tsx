import { Contact as ContactComponent } from '../components/Contact';
import { SocialSection } from '../components/SocialSection';
import { PageTransition } from '../components/PageTransition';

export function Contact() {
  return (
    <PageTransition>
      <main>
        <ContactComponent />
        <SocialSection />
      </main>
    </PageTransition>
  );
}

export default Contact;
