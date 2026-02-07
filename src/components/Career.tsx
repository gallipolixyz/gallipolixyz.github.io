import React from 'react';
import { Shield, Users, Target, Brain, Heart } from 'lucide-react';

export function Career() {
  return (
    <div className="min-h-screen bg-black text-custom-cyan py-20">
      <div className="container mx-auto px-4">

        {/* Introduction */}
        <section className="mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Gallipoli Career Matching Program_
          </h1>
          <div className="max-w-3xl mx-auto text-lg font-mono">
            <p className="mb-6">
              As the Gallipoli Cybersecurity Community, we aim to bring together professionals
              seeking careers in cybersecurity with companies looking for the right talent.
            </p>
            <p className="mb-6">
              This page has been prepared as part of the Gallipoli Career Matching Program.
              The application here is <strong>not</strong> a community membership application;
              it is designed to better understand candidate profiles and match them with suitable
              job and collaboration opportunities.
            </p>
          </div>
        </section>

        {/* Purpose of the Program */}
        <section className="mb-20 bg-custom-cyan/5 rounded-xl p-8 backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Purpose of the Program_
          </h2>
          <div className="max-w-3xl mx-auto text-lg font-mono space-y-4">
            <p>
              • Supporting candidates who want to build a career in cybersecurity or change their career direction
            </p>
            <p>
              • Matching candidate profiles more accurately with the skills companies need
            </p>
            <p>
              • Making the job search and talent discovery process simpler, safer, and more transparent
            </p>
            <p className="pt-4">
              Gallipoli does not act as a recruitment company in this process; instead, it takes on
              a connecting and facilitating role.
            </p>
          </div>
        </section>

        {/* What We Expect */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            What Do We Expect from Candidates?_
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Optional CV",
                description: "An up-to-date CV can be shared optionally to better understand your background."
              },
              {
                title: "Short Application",
                description: "Answers to a few guiding questions in the short application form."
              },
              {
                title: "Career Goals",
                description: "Information about your interests, experience level, and career direction."
              },
              {
                title: "Right Fit",
                description: "Technical level alone is not decisive; the goal is the right level and expectations."
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-custom-cyan/5 p-6 rounded-lg backdrop-blur-sm hover:bg-custom-cyan/10 transition-all duration-300 click-ripple interactive-hover"
              >
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="font-mono text-custom-cyan/80">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-20 bg-custom-cyan/5 rounded-xl p-8 backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            How Does the Process Work?_
          </h2>
          <div className="max-w-3xl mx-auto text-lg font-mono space-y-4">
            <p>• The application form on the Career page is filled out</p>
            <p>• Applications are reviewed by the Gallipoli team</p>
            <p>• Candidate profiles are evaluated based on current company needs</p>
            <p>• When a suitable match is found, the candidate is contacted</p>
            <p>• The hiring process continues directly with the relevant company</p>
            <p className="pt-4 text-custom-cyan/80">
              Matching depends on company needs and suitability; placement is not guaranteed
              for every application.
            </p>
          </div>
        </section>

        {/* Application */}
<section className="text-center">
  <h2 className="text-3xl md:text-4xl font-bold mb-8">
    Application_
  </h2>

  <div className="max-w-3xl mx-auto text-lg font-mono">
    <p className="mb-6">
      You can apply to the Gallipoli Career Matching Program by filling out the
      application form.
    </p>

    <div className="flex justify-center">
      <a
        href="https://docs.google.com/forms/d/1XJPbnDmhhoLHa19oPkcCG4J9TFbk77PB5F-KFV0axFc/viewform?ts=69873a71&edit_requested=true"
        target="_blank"
        rel="noopener noreferrer"
        className="click-ripple interactive-hover px-8 py-4 bg-custom-cyan/10 border border-custom-cyan/50 rounded-lg font-mono text-custom-cyan hover:bg-custom-cyan/20 hover:border-white hover:text-white transition-all"
      >
        Apply via Google Form_
      </a>
    </div>

    <p className="mt-4 text-sm text-custom-cyan/70">
      The form will open in a new tab. Your CV will be securely uploaded to our system.
    </p>
  </div>
</section>
      </div>
    </div>
  );
}
