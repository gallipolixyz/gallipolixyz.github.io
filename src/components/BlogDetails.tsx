import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ScrollAnimation } from './ScrollAnimation';

interface BlogData {
  title: string;
  content: string;
}

export const BlogDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/blogs/${slug}.md`);
        if (!res.ok) throw new Error('Failed to load');
        const text = await res.text();

        const match = text.match(/^---\n([\s\S]+?)\n---/);
        let meta: any = {};
        let markdownBody = text;

        if (match) {
          const metaBlock = match[1];
          markdownBody = text.slice(match[0].length);

          metaBlock.split('\n').forEach(line => {
            const [key, ...rest] = line.split(':');
            meta[key.trim()] = rest.join(':').trim();
          });
        }

        const firstLine = markdownBody.split('\n')[0];
        if (firstLine.startsWith('# ')) {
          setTitle(firstLine.replace('# ', '').trim());
          setContent(markdownBody.split('\n').slice(1).join('\n'));
        } else {
          setTitle(slug?.replace(/-/g, ' ') || '');
          setContent(markdownBody);
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-slate-900 to-gray-900 text-sky-200 py-20 px-6 relative overflow-hidden">

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow:
            '0 0 200px 100px rgba(14, 116, 144, 0.3), 0 0 400px 200px rgba(14, 116, 144, 0.15)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      ></div>

      <div className="container mx-auto max-w-7xl relative z-10">

        <ScrollAnimation direction="up" delay={0.1}>
          <h1 className="text-6xl font-extrabold text-center mb-4 leading-tight tracking-wide pb-2">
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400 text-transparent bg-clip-text drop-shadow-lg">
              {title || slug?.replace(/-/g, ' ')}
            </span>
          </h1>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.2}>
          <article
            className="prose prose-invert max-w-4xl mx-auto bg-white/10 border border-cyan-300/20 rounded-3xl p-16 shadow-xl backdrop-blur-md"
            style={{
              lineHeight: '1.9',
              fontFamily: "'Inter', sans-serif",
              wordBreak: 'break-word',
              boxShadow: '0 8px 32px 0 rgba(14, 116, 144, 0.5)',
              color: '#cde7f0',
              transition: 'all 0.3s ease',
            }}
          >
            {loading && (
              <p className="text-center font-mono text-cyan-300/70">
                Loading blog content...
              </p>
            )}
            {error && (
              <p className="text-center font-mono text-red-500">
                Sorry, we couldn't load this blog post.
              </p>
            )}
            {!loading && !error && (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            )}
          </article>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.3}>
          <div className="mt-16 text-center">
            <a
              href="/blog"
              className="inline-block mt-6 px-8 py-3 border-2 border-sky-400/50 rounded-lg font-mono text-lg hover:bg-sky-500/20 hover:border-white hover:text-white transition duration-300 cursor-pointer"
            >
              ← Back to Blog List
            </a>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default BlogDetails;
