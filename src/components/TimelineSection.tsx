import { StoryTimeline } from './StoryTimeline';

export function TimelineSection() {
  return (
    <section id="timeline" className="scroll-mt-24 bg-black pt-10">
      <div className="max-w-4xl mx-auto px-4 text-center mt-10">
        <h1 className="text-5xl font-extrabold text-custom-cyan uppercase tracking-widest mb-4">
          Gallipoli History_
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          Every step we have taken and every milestone we have achieved in the cybersecurity ecosystem—from day one to today.
        </p>
      </div>

      <StoryTimeline />
    </section>
  );
}
