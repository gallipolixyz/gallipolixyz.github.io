import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, BookOpen, Wrench, Target, Award, Mail, Clock, Star } from 'lucide-react';
import { ScrollAnimation } from './ScrollAnimation';
import { getProgramById } from '../data/programs';

export function ProgramDetails() {
  const { id } = useParams<{ id: string }>();
  const program = getProgramById(id || '');

  if (!program) {
    return (
      <div className="min-h-screen bg-black text-custom-cyan py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-8">Program Not Found</h1>
          <p className="text-custom-cyan/80 mb-8">The program you're looking for doesn't exist.</p>
          <Link
            to="/programs"
            className="inline-flex items-center px-6 py-3 bg-custom-cyan/10 border border-custom-cyan/50 rounded-lg text-custom-cyan hover:bg-custom-cyan/20 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Programs
          </Link>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    Beginner: 'text-green-400',
    Intermediate: 'text-yellow-400',
    Advanced: 'text-red-400'
  };

  return (
    <div className="min-h-screen bg-black text-custom-cyan py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <ScrollAnimation>
          <div className="mb-12">
            <Link
              to="/programs"
              className="inline-flex items-center text-custom-cyan/70 hover:text-custom-cyan mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Programs
            </Link>

            <div className="flex items-center mb-6">
              <program.icon className="w-12 h-12 text-custom-cyan mr-4" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">{program.title}</h1>
                <p className="text-xl text-custom-cyan/80 mt-2">{program.shortDescription}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{program.duration}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span className={difficultyColors[program.difficulty]}>{program.difficulty}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{program.curriculum.length} weeks</span>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <ScrollAnimation delay={0.1}>
              <section>
                <h2 className="text-2xl font-bold mb-4">About This Program_</h2>
                <p className="text-custom-cyan/90 leading-relaxed">{program.fullDescription}</p>
              </section>
            </ScrollAnimation>

            {/* What You Will Learn */}
            <ScrollAnimation delay={0.2}>
              <section>
                <h2 className="text-2xl font-bold mb-6">What You Will Learn_</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <Target className="w-5 h-5 text-custom-cyan mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-custom-cyan/80">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            </ScrollAnimation>

            {/* Curriculum */}
            <ScrollAnimation delay={0.3}>
              <section>
                <h2 className="text-2xl font-bold mb-6">Curriculum_</h2>
                <div className="space-y-4">
                  {program.curriculum.map((week, index) => (
                    <div key={index} className="bg-custom-cyan/5 border border-custom-cyan/20 rounded-lg p-6">
                      <h3 className="text-lg font-bold mb-3">
                        Week {week.week}: {week.title}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {week.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="flex items-center text-sm">
                            <BookOpen className="w-3 h-3 text-custom-cyan mr-2" />
                            <span className="text-custom-cyan/70">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </ScrollAnimation>

            {/* Tools */}
            <ScrollAnimation delay={0.4}>
              <section>
                <h2 className="text-2xl font-bold mb-6">Tools & Technologies_</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {program.tools.map((tool, index) => (
                    <div key={index} className="flex items-center">
                      <Wrench className="w-4 h-4 text-custom-cyan mr-2" />
                      <span className="text-custom-cyan/80">{tool}</span>
                    </div>
                  ))}
                </div>
              </section>
            </ScrollAnimation>

            {/* Outcomes */}
            <ScrollAnimation delay={0.5}>
              <section>
                <h2 className="text-2xl font-bold mb-6">Program Outcomes_</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start">
                      <Award className="w-5 h-5 text-custom-cyan mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-custom-cyan/80">{outcome}</span>
                    </div>
                  ))}
                </div>
              </section>
            </ScrollAnimation>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Mentor */}
            <ScrollAnimation delay={0.2}>
              <section className="bg-custom-cyan/5 border border-custom-cyan/20 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Your Mentor_</h3>
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-custom-cyan/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Users className="w-8 h-8 text-custom-cyan" />
                  </div>
                  <h4 className="text-lg font-bold">{program.mentor.name}</h4>
                  <p className="text-custom-cyan/70 text-sm">{program.mentor.role}</p>
                </div>
                <p className="text-custom-cyan/80 text-sm mb-4">{program.mentor.bio}</p>
                <div>
                  <h5 className="font-bold text-sm mb-2">Expertise:</h5>
                  <div className="space-y-1">
                    {program.mentor.expertise.map((skill, index) => (
                      <div key={index} className="flex items-center text-xs">
                        <Star className="w-3 h-3 text-custom-cyan mr-2" />
                        <span className="text-custom-cyan/70">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </ScrollAnimation>

            {/* Prerequisites */}
            <ScrollAnimation delay={0.3}>
              <section className="bg-custom-cyan/5 border border-custom-cyan/20 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Prerequisites_</h3>
                <div className="space-y-2">
                  {program.prerequisites.map((prereq, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-custom-cyan rounded-full mr-3 mt-2 flex-shrink-0" />
                      <span className="text-custom-cyan/80 text-sm">{prereq}</span>
                    </div>
                  ))}
                </div>
              </section>
            </ScrollAnimation>

            {/* Enrollment */}
            <ScrollAnimation delay={0.4}>
              <section className="bg-custom-cyan/5 border border-custom-cyan/20 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Enrollment_</h3>
                <p className="text-custom-cyan/80 text-sm mb-4">{program.enrollmentInfo}</p>
                <a
                  href="https://t.me/gallipolixyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-custom-cyan/10 border border-custom-cyan/50 rounded-lg text-custom-cyan hover:bg-custom-cyan/20 hover:border-white hover:text-white transition-all duration-300"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Apply Now
                </a>
              </section>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </div>
  );
} 