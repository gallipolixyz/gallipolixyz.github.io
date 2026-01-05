import React from 'react';
import { Shield, Users, Target, Brain, Heart } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-black text-custom-cyan py-20">
      <div className="container mx-auto px-4">
        {/* Introduction */}
        <section className="mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">What is Gallipoli_</h1>
          <div className="max-w-3xl mx-auto text-lg font-mono">
            <p className="mb-6">
              Gallipoli is more than a cybersecurity community—it's a movement. We are hackers, defenders, and innovators united by our passion for technology and our commitment to making the digital world safer for everyone.
            </p>
            <p className="mb-6">
              We blend the innovative spirit of hacker culture with the historical legacy of strategic thinking and resilience. Just as the historical Gallipoli campaign demonstrated the power of determination and tactical innovation, our community stands at the forefront of cybersecurity evolution.
            </p>
          </div>
        </section>

        {/* Video Gallery */}
<section className="mb-20 bg-custom-cyan/5 rounded-xl p-8 backdrop-blur-sm">
  <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
    What Experts Say About Gallipoli_
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
    {[
      "y_DTZ1oLcJs",
      "JBwqzM-Skag",
      "9lkQj2xUujk"
    ].map((id) => (
      <div
        key={id}
        className="relative w-full rounded-xl overflow-hidden border border-custom-cyan/30"
        style={{ paddingTop: "56.25%" }}
      >
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title="Gallipoli Video"
          frameBorder={0}
          allowFullScreen
        />
      </div>
    ))}
  </div>
</section>

        {/* Our Story */}
        <section className="mb-20 bg-custom-cyan/5 rounded-xl p-8 backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Story_</h2>
          <div className="max-w-3xl mx-auto text-lg font-mono">
            <p className="mb-6">
              Born from a group of ethical hackers who believed in the power of community, Gallipoli emerged as a response to the growing need for collaborative cybersecurity education and practice. Our name draws inspiration from the historic Gallipoli campaign—a testament to courage, strategy, and the power of determined individuals working together.
            </p>
            <p className="mb-6">
              Like the soldiers who demonstrated extraordinary resilience at Gallipoli, our community members show unwavering dedication to protecting digital freedoms and fostering innovation through ethical hacking.
            </p>
          </div>
        </section>

        {/* What We Stand For */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">What We Stand For_</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Ethical Hacking",
                description: "We believe in using our skills for good, protecting systems and people through responsible disclosure and ethical practices."
              },
              {
                icon: Brain,
                title: "Open Knowledge",
                description: "Knowledge should be free and accessible. We share, learn, and grow together as a community."
              },
              {
                icon: Target,
                title: "Real Impact",
                description: "We focus on making tangible improvements to cybersecurity through practical action and collaboration."
              },
              {
                icon: Heart,
                title: "Community First",
                description: "'A hacker saved my life' isn't just our motto—it's a testament to how technology and community can transform lives."
              }
            ].map((principle, index) => (
              <div key={index} className="bg-custom-cyan/5 p-6 rounded-lg backdrop-blur-sm hover:bg-custom-cyan/10 transition-all duration-300 click-ripple interactive-hover">
                <principle.icon className="w-12 h-12 mb-4 text-custom-cyan" />
                <h3 className="text-xl font-bold mb-3">{principle.title}</h3>
                <p className="font-mono text-custom-cyan/80">{principle.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-20 bg-custom-cyan/5 rounded-xl p-8 backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Mission_</h2>
          <div className="max-w-3xl mx-auto text-lg font-mono">
            <p className="mb-6">
              To empower individuals with the knowledge, tools, and community support needed to become effective defenders of digital security. We believe that cybersecurity is not just about technical skills—it's about fostering a mindset of continuous learning, ethical behavior, and community contribution.
            </p>
            <p className="mb-6">
              Our motto, "A hacker saved my life," embodies our belief in the transformative power of ethical hacking and community support. It's a reminder that our skills and knowledge can make a real difference in people's lives.
            </p>
          </div>
        </section>

        {/* Join Us */}
        <section className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Join Us_</h2>
          <div className="max-w-3xl mx-auto text-lg font-mono text-center">
            <p className="mb-6">
              Gallipoli is built and maintained by passionate individuals who believe in the power of community-driven cybersecurity education and practice.
            </p>
            <div className="flex justify-center">
              <a 
                href="https://t.me/+IHIHLmSbufxlNjdk"
                target="_blank"
                rel="noopener noreferrer"
                className="click-ripple interactive-hover px-6 py-3 bg-custom-cyan/10 border border-custom-cyan/50 rounded-lg font-mono text-custom-cyan hover:bg-custom-cyan/20 hover:border-white hover:text-white transition-all"
              >
                Join Our Community_
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}