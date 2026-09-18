import React from 'react';
import {
  Mail,
  Users,
  Briefcase,
  Mic2,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';

const CAREER_FORM_URL = '#';
const CONTACT_FORM_URL = '#';
const GUEST_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScobBPi-s6uG5f2KZGH_9dLlxrKCESxYqzy4G4gr1xXlvq58w/viewform?usp=header';

export function Contact() {
  return (
    <div className="min-h-screen bg-black text-custom-cyan py-20">
      <div className="container mx-auto px-4">

        {/* Header */}
        <section className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            Contact_
          </h1>

          <div className="max-w-3xl mx-auto text-lg font-mono text-custom-cyan/80">
            <p className="mb-6">
              Whether you want to join our community, collaborate with us,
              share your knowledge, or simply get in touch, we would love
              to hear from you.
            </p>

            <p>
              Gallipoli is built around learning, sharing knowledge, and
              growing together in the field of cybersecurity.
            </p>
          </div>
        </section>

        {/* Contact Options */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

            {/* Career */}
            <div className="bg-custom-cyan/5 p-8 rounded-xl border border-custom-cyan/20 backdrop-blur-sm hover:bg-custom-cyan/10 hover:border-custom-cyan/40 transition-all duration-300">
              <Briefcase className="w-12 h-12 mb-6 text-custom-cyan" />

              <h2 className="text-2xl font-bold mb-4">
                Join Our Team_
              </h2>

              <p className="font-mono text-custom-cyan/80 mb-6">
                Want to contribute to Gallipoli and become part of the
                team? If you are interested in cybersecurity, content
                creation, community management, design, development, or
                other areas, we would be happy to hear from you.
              </p>

              <a
                href={CAREER_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-custom-cyan/10 border border-custom-cyan/50 rounded-lg font-mono text-custom-cyan hover:bg-custom-cyan/20 hover:border-white hover:text-white transition-all"
              >
                Career Form
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Contact Form */}
            <div className="bg-custom-cyan/5 p-8 rounded-xl border border-custom-cyan/20 backdrop-blur-sm hover:bg-custom-cyan/10 hover:border-custom-cyan/40 transition-all duration-300">
              <MessageSquare className="w-12 h-12 mb-6 text-custom-cyan" />

              <h2 className="text-2xl font-bold mb-4">
                Get in Touch_
              </h2>

              <p className="font-mono text-custom-cyan/80 mb-6">
                Have a question, collaboration idea, or something you
                would like to discuss with us? Feel free to reach out
                through our contact form.
              </p>

              <a
                href={CONTACT_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-custom-cyan/10 border border-custom-cyan/50 rounded-lg font-mono text-custom-cyan hover:bg-custom-cyan/20 hover:border-white hover:text-white transition-all"
              >
                Contact Form
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>
        </section>

        {/* Guest Application */}
        <section className="mb-20">
          <div className="max-w-5xl mx-auto bg-custom-cyan/5 rounded-xl p-8 md:p-10 border border-custom-cyan/20 backdrop-blur-sm">

            <div className="flex flex-col md:flex-row gap-8 items-start">

              <div className="flex-shrink-0">
                <Mic2 className="w-14 h-14 text-custom-cyan" />
              </div>

              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-5">
                  Be Our Guest_
                </h2>

                <p className="font-mono text-custom-cyan/80 mb-5">
                  Do you have knowledge, experience, or a unique
                  perspective that you would like to share with the
                  cybersecurity community?
                </p>

                <p className="font-mono text-custom-cyan/80 mb-6">
                  We regularly bring together security professionals,
                  researchers, developers, students, and technology
                  enthusiasts through our live broadcasts. If you would
                  like to join one of our broadcasts as a guest, tell us
                  a little about yourself and the topic you would like
                  to discuss.
                </p>

                <a
                  href={GUEST_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-custom-cyan/10 border border-custom-cyan/50 rounded-lg font-mono text-custom-cyan hover:bg-custom-cyan/20 hover:border-white hover:text-white transition-all"
                >
                  Guest Application Form
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* Email */}
        <section className="mb-20">
          <div className="max-w-3xl mx-auto text-center bg-custom-cyan/5 rounded-xl p-8 border border-custom-cyan/20 backdrop-blur-sm">

            <Mail className="w-12 h-12 mx-auto mb-5 text-custom-cyan" />

            <h2 className="text-3xl md:text-4xl font-bold mb-5">
              Email Us_
            </h2>

            <p className="font-mono text-custom-cyan/70 mb-6">
              For general inquiries, collaborations, and other
              community-related matters, you can reach us by email.
            </p>

            <a
              href="mailto:gallipolixyz@gmail.com"
              className="inline-flex items-center gap-2 text-lg font-mono text-custom-cyan hover:text-white transition-colors"
            >
              gallipolixyz@gmail.com
              <ExternalLink className="w-4 h-4" />
            </a>

          </div>
        </section>

        {/* Community */}
        <section className="text-center">
          <Users className="w-12 h-12 mx-auto mb-6 text-custom-cyan" />

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the Community_
          </h2>

          <div className="max-w-3xl mx-auto text-lg font-mono">
            <p className="mb-8 text-custom-cyan/80">
              Gallipoli is a community built around learning, sharing,
              and growing together. If you are interested in cybersecurity
              and want to connect with people who share the same passion,
              you are always welcome.
            </p>

            <div className="flex justify-center">
              <a
                href="https://t.me/gallipolixyz"
                target="_blank"
                rel="noopener noreferrer"
                className="click-ripple interactive-hover inline-flex items-center gap-2 px-6 py-3 bg-custom-cyan/10 border border-custom-cyan/50 rounded-lg font-mono text-custom-cyan hover:bg-custom-cyan/20 hover:border-white hover:text-white transition-all"
              >
                Join Our Community_
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
},
