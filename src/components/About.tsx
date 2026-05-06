import React from 'react';
import { Shield, Users, Target, Brain, Heart } from 'lucide-react';

export function About() {
  const featuredStats = [
    { label: 'Community Size', value: '7.5K+' },
    { label: 'Total Views', value: '48K+' },
  ];

  const reachStats = [
    { label: 'Content Hours', value: '1.5K+' },
    { label: 'Live Sessions', value: '30+' },
    { label: 'Guest Speakers', value: '30+' },
  ];

  const productionStats = [
    { label: 'Video Content', value: '120+' },
    { label: 'Blog Posts', value: '50+' },
    { label: 'Educational Content', value: '95+' },
  ];

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
              "lz7nPJ_IEI0",
              "Z5pL7hcot9A",
              "j2o9rQrvgiM"
            ].map((id) => (
              <div
                key={id}
                className="relative w-full rounded-xl overflow-hidden border border-custom-cyan/30"
                style={{ paddingTop: "56.25%" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${id}?playsinline=1&rel=0`}
                  title="Gallipoli Video"
                  loading="lazy"
                  allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
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

        {/* Our Impact */}
        <section className="relative mb-20 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.08),rgba(0,0,0,0)_58%)]" />
          <div className="relative max-w-6xl mx-auto">
            <div className="mb-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact_</h2>
              <p className="font-mono text-sm md:text-base text-custom-cyan/60">
                A quick overview of our community's growth, reach, and knowledge-sharing activity.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-custom-cyan/20 bg-custom-cyan/[0.03] p-5 md:p-7 backdrop-blur-sm">
              <div className="absolute inset-x-0 top-0 h-px bg-custom-cyan/35" />
              <div className="relative z-10 mb-6">
                <h3 className="text-sm md:text-base uppercase tracking-widest font-mono text-custom-cyan mb-2">
                  Featured Impact Metrics
                </h3>
                <p className="font-mono text-sm text-custom-cyan/55">
                  Our strongest signals of community growth and reach.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {featuredStats.map((stat, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-2xl border border-custom-cyan/30 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.15),rgba(0,255,255,0.045)_48%,rgba(0,0,0,0)_84%)] p-8 md:p-10 text-center backdrop-blur-sm flex flex-col items-center justify-center shadow-[0_0_22px_rgba(0,255,255,0.08)] transition-all duration-300 hover:scale-[1.02] hover:border-custom-cyan/50 hover:bg-custom-cyan/10 hover:shadow-[0_0_24px_rgba(0,255,255,0.18)]"
                  >
                    <span className="text-5xl md:text-6xl font-bold text-custom-cyan mb-3">
                      {stat.value}
                    </span>
                    <span className="text-custom-cyan/70 text-xs md:text-sm uppercase tracking-widest font-mono text-center">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="relative overflow-hidden rounded-2xl border border-custom-cyan/20 bg-custom-cyan/[0.03] p-5 md:p-7 backdrop-blur-sm">
                <div className="absolute inset-x-0 top-0 h-px bg-custom-cyan/35" />
                <div className="relative z-10 mb-6 rounded-xl border border-custom-cyan/15 bg-black/20 px-4 py-3">
                  <h3 className="text-sm md:text-base uppercase tracking-widest font-mono text-custom-cyan mb-2">
                    Reach & Activity
                  </h3>
                  <p className="font-mono text-sm text-custom-cyan/55">
                    Live sessions, content hours, and people sharing knowledge with the community.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-4">
                  {reachStats.map((stat, index) => (
                    <div 
                      key={index} 
                      className="relative overflow-hidden rounded-xl border border-custom-cyan/25 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.12),rgba(0,255,255,0.045)_48%,rgba(0,0,0,0)_82%)] p-6 md:p-7 text-center backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.02] hover:border-custom-cyan/45 hover:bg-custom-cyan/10 hover:shadow-[0_0_22px_rgba(0,255,255,0.16)]"
                    >
                      <span className="text-3xl md:text-4xl font-bold text-custom-cyan mb-2">
                        {stat.value}
                      </span>
                      <span className="text-custom-cyan/70 text-xs md:text-sm uppercase tracking-widest font-mono text-center">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-custom-cyan/20 bg-custom-cyan/[0.03] p-5 md:p-7 backdrop-blur-sm">
                <div className="absolute inset-x-0 top-0 h-px bg-custom-cyan/35" />
                <div className="relative z-10 mb-6 rounded-xl border border-custom-cyan/15 bg-black/20 px-4 py-3">
                  <h3 className="text-sm md:text-base uppercase tracking-widest font-mono text-custom-cyan mb-2">
                    Content & Knowledge
                  </h3>
                  <p className="font-mono text-sm text-custom-cyan/55">
                    Educational materials and written/video content created for the ecosystem.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-4">
                  {productionStats.map((stat, index) => (
                    <div 
                      key={index} 
                      className="relative overflow-hidden rounded-xl border border-custom-cyan/20 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.1),rgba(0,255,255,0.04)_48%,rgba(0,0,0,0)_82%)] p-6 md:p-7 text-center backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.02] hover:border-custom-cyan/45 hover:bg-custom-cyan/10 hover:shadow-[0_0_22px_rgba(0,255,255,0.14)]"
                    >
                      <span className="text-3xl md:text-4xl font-bold text-custom-cyan/90 mb-2">
                        {stat.value}
                      </span>
                      <span className="text-custom-cyan/70 text-xs md:text-sm uppercase tracking-widest font-mono text-center">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
                href="https://t.me/gallipolixyz"
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