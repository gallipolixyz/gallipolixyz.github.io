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
    slug: 'phishing-email-analysis',
    title: 'Oltalama E-postası Analizi: Gerçek Bir Örnek Üzerinden',
    excerpt: 'Bu makalede gerçek bir oltalama e-postası örneği üzerinden, e-postanın içeriğini, kullanılan teknikleri ve nasıl tespit edilebileceğini inceleyeceğiz.',
    author: 'Rakun Toygun',
  },  
    {
    slug: 'custom-log-source-normalization',
    title: 'Custom Log Source Normalization: SIEM Öncesi ve  Sonrası Tüm Aşamalar',
    excerpt: 'Bu makalede özelleştirilmiş log kaynaklarının normalizasyonu, SIEM öncesi ve sonrası tüm aşamalarıyla ele alınacaktır.',
    author: 'Ümmühan Atmaca',
  }, 
    {
    slug: 'c2-framework-nedir',
    title: 'C2 Framework Nedir? Amaçları, Faydaları ve En Popüler C2 Araçları',
    excerpt: 'Bu makalede C2 frameworklerinin ne olduğunu, nasıl çalıştığını, amaçlarını ve en popüler C2 araçlarını keşfedeceğiz.',
    author: 'Hilal Kavas',
  },  
    {
    slug: 'saldirganin-yol-haritasi',
    title: 'Saldırganın Yol Haritası',
    excerpt: 'Bu makalede, saldırganların bir hedefe nasıl yaklaşabileceğini, hangi adımları takip edebileceğini ve bu süreçte karşılaşabilecekleri zorlukları keşfedeceğiz.',
    author: 'Nur Sena Avcı',
  },  
  {
    slug: 'redos-zafiyeti',
    title: 'ReDoS (Regular Expression Denial of Service) Zafiyeti',
    excerpt: 'This article explores how a single SSRF vulnerability was exploited five times using different techniques, each bypassing a new layer of defense and earning a separate bounty.',
    author: 'Hilal Kavas',
  },
  {
    slug: 'five-bounties-one-bug',
    title: 'Five Bounties, One Bug: Exploiting the Same SSRF via Five Unique Techniques',
    excerpt: 'This article explores how a single SSRF vulnerability was exploited five times using different techniques, each bypassing a new layer of defense and earning a separate bounty.',
    author: 'Kayra Oksuz',
  },
  {
    slug: 'cti-on-telegram',
    title: 'Telegram Üzerinden Siber Tehdit İstihbaratı (CTI)',
    excerpt: 'Telegram’da yürütülen siber tehdit faaliyetlerini nasıl izleyeceğinizi, veri toplayacağınızı ve analiz edeceğinizi adım adım keşfedeceğiz.',
    author: 'Ayşe Bayraktar',
  },
  {
    slug: 'blue-team-beginners-guide',
    title: 'Mavi Takım Başlangıç Rehberi',
    excerpt: 'Mavi takım, siber güvenlik alanında savunma odaklı bir yaklaşımdır. Bu rehberde, mavi takımın temel ilkelerini ve nasıl etkili bir şekilde çalıştığını keşfedeceğiz.',
    author: 'Nur Sena Avcı',
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
              <Link
                to={`/blog/${blog.slug}`}
                className="h-[260px] flex flex-col justify-between bg-custom-cyan/5 border border-custom-cyan/30 rounded-lg overflow-hidden hover:bg-custom-cyan/10 hover:border-custom-cyan/50 transition-all duration-300 cursor-pointer"
                style={{ textDecoration: 'none' }}
              >
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2 line-clamp-2">{blog.title}</h2>
                    <p className="text-custom-cyan/70 font-mono text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-custom-cyan/60 font-mono">Author: {blog.author}</p>
                    <span className="inline-flex items-center text-custom-cyan font-mono text-sm hover:text-white transition">
                      Read More
                      <motion.span whileHover={{ x: 5 }} className="ml-2">
                        →
                      </motion.span>
                    </span>
                  </div>
                </div>
              </Link>
            </CardAnimation>
          ))}
        </motion.div>

        <ScrollAnimation direction="up" delay={0.2}>
          <section className="text-center mt-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Want to Share Your Knowledge?</h2>
            <p className="font-mono text-custom-cyan/90 mb-8 max-w-2xl mx-auto">
              If you have insights, experiences, or stories about cybersecurity, we’d love to hear from you.
              Contribute to our blog and inspire others in the community!
            </p>
            <a
              href="https://t.me/+IHIHLmSbufxlNjdk"
              target="_blank"
              rel="noopener noreferrer"
              className="click-ripple interactive-hover group inline-flex items-center px-8 py-4 bg-custom-cyan/10 border-2 border-custom-cyan/50 rounded-lg font-mono text-lg text-custom-cyan hover:bg-custom-cyan/20 hover:border-white hover:text-white transition-all duration-300"
            >
              Share Your Article
              <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </section>
        </ScrollAnimation>

      </div>
    </div>
  );
};

export default BlogList;
