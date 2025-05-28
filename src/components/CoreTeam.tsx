import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CardAnimation } from '../components/CardAnimation';
import { ScrollAnimation } from '../components/ScrollAnimation';

interface Blog {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
}

const blogs: Blog[] = [
  {
    slug: 'example',
    title: 'Introduction to Ethical Hacking',
    excerpt: 'Explore the basics of ethical hacking, including tools, methodologies, and why it’s more relevant than ever.',
    author: 'MG',
  },
  {
    slug: 'red-teaming-insights',
    title: 'Red Teaming Insights',
    excerpt: 'How red teams emulate real-world attackers to help organizations strengthen their defenses.',
    author: 'RØØNIN',
  },
  {
    slug: 'api-security',
    title: 'Modern API Security',
    excerpt: 'Best practices and vulnerabilities in modern APIs, from OWASP top 10 to real-world exploits.',
    author: 'caner',
  },
  {
    slug: 'malware-analysis',
    title: 'Intro to Malware Analysis',
    excerpt: 'A beginner-friendly guide to understanding and dissecting malicious code samples.',
    author: 'Revivalist',
  },
];

export const BlogList: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen bg-black text-custom-cyan py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <ScrollAnimation>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Blog</h1>
          <p className="text-center max-w-3xl mx-auto mb-16 text-lg font-mono text-custom-cyan/90 leading-relaxed">
            Welcome to Gallipoli's blog section — your gateway to practical insights, tips, and
            stories from the world of cybersecurity.
          </p>
        </ScrollAnimation>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {blogs.map((blog, index) => (
            <CardAnimation key={blog.slug} index={index}>
              <div className="bg-custom-cyan/5 border border-custom-cyan/30 rounded-lg overflow-hidden hover:bg-custom-cyan/10 hover:border-custom-cyan/50 transition-all duration-300">
                <div className="p-6 flex flex-col h-full justify-between">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
                    <p className="text-custom-cyan/70 font-mono text-sm mb-4">{blog.excerpt}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-custom-cyan/50 font-mono">Author: {blog.author}</p>
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="inline-flex items-center text-custom-cyan font-mono text-sm hover:text-white transition"
                    >
                      Read More
                      <motion.span whileHover={{ x: 5 }} className="ml-2">
                        →
                      </motion.span>
                    </Link>
                  </div>
                </div>
              </div>
            </CardAnimation>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogList;
