import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { ScrollAnimation } from './ScrollAnimation';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Copy, Check } from 'lucide-react';
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';

const IMAGE_DOMAIN_WHITELIST: string[] = [
];

const isValidSlug = (s: string) => /^[a-z0-9-]{1,100}$/.test(s);

const isSafeHttpUrl = (url: string) => {
  try {
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) return !url.startsWith('../');
    const u = new URL(url, window.location.origin);
    return (u.protocol === 'http:' || u.protocol === 'https:') && !/^(javascript|data|vbscript):/i.test(u.protocol);
  } catch {
    return false;
  }
};

const isAllowedImageSrc = (src: string) => {
  try {
    if (src.startsWith('/') || src.startsWith('./')) return true;
    if (src.startsWith('data:')) return false;
    const u = new URL(src, window.location.origin);
    if (u.origin === window.location.origin) return true;
    if (IMAGE_DOMAIN_WHITELIST.length === 0) return true;
    return IMAGE_DOMAIN_WHITELIST.some((d) => u.hostname === d || u.hostname.endsWith('.' + d));
  } catch {
    return false;
  }
};

const sanitizedSchema: Parameters<typeof rehypeSanitize>[0] = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [ ...(defaultSchema.attributes?.a || []), ['target'], ['rel'] ],
    code: [ ...(defaultSchema.attributes?.code || []), ['className'] ],
    img: [ ...(defaultSchema.attributes?.img || []), ['src'], ['alt'], ['title'], ['loading'], ['decoding'] ],
  },
};

export const BlogDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const safeSlug = useMemo(() => {
    if (!slug) return null;
    if (!isValidSlug(slug)) return null;
    if (slug.includes('..') || slug.includes('//')) return null;
    return slug;
  }, [slug]);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!safeSlug) {
        setError('Invalid article identifier.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/blogs/${encodeURIComponent(safeSlug)}.md`, {
          credentials: 'same-origin',
          headers: { 'Accept': 'text/markdown, text/plain; q=0.9' },
        });
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const text = await res.text();

        const match = text.match(/^---\n([\s\S]+?)\n---/);
        let markdownBody = text;

        if (match) {
          markdownBody = text.slice(match[0].length);
        }

        const firstLine = markdownBody.split('\n')[0];
        if (firstLine.startsWith('# ')) {
          setTitle(firstLine.replace('# ', '').trim());
          setContent(markdownBody.split('\n').slice(1).join('\n'));
        } else {
          setTitle(safeSlug.replace(/-/g, ' '));
          setContent(markdownBody);
        }
      } catch (e) {
        console.error('Blog load error', e);
        setError('We\'re sorry, the requested blog post could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [safeSlug]);

  const urlTransform = (url: string, key: string) => {
    if (key === 'href') return isSafeHttpUrl(url) ? url : '#';
    if (key === 'src') return isAllowedImageSrc(url) ? url : '';
    return url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-slate-900 to-gray-900 text-sky-200 py-20 px-3 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: '0 0 200px 100px rgba(14, 116, 144, 0.3), 0 0 400px 200px rgba(14, 116, 144, 0.15)', filter: 'blur(80px)', zIndex: 0 }} />

      <div className="container mx-auto max-w-7xl relative z-10">
        <ScrollAnimation direction="up" delay={0.1}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-4 leading-tight tracking-wide ">
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400 text-transparent bg-clip-text drop-shadow-lg">
              {title || safeSlug?.replace(/-/g, ' ')}
            </span>
          </h1>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.2}>
          <article className="prose prose-invert mx-auto w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl bg-white/5 border border-cyan-300/10 rounded-xl sm:rounded-3xl px-2 sm:px-4 md:px-6 lg:px-10 py-4 sm:py-8 md:py-12 shadow-xl prose-p:max-w-none prose-headings:max-w-none" style={{ lineHeight: '1.9', fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", wordBreak: 'break-word', boxShadow: '0 8px 32px 0 rgba(14, 116, 144, 0.5)', color: '#e2e8f0', transition: 'all 0.3s ease', fontSize: '1.15rem', backdropFilter: 'none' }}>
            {loading && (<p className="text-center font-mono text-cyan-300/70">Loading blog content...</p>)}
            {error && (<p className="text-center font-mono text-red-500">{error}</p>)}
            {!loading && !error && (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[[rehypeSanitize, sanitizedSchema]]}
                urlTransform={urlTransform}
                components={{
                  a: ({node, href, children, ...props}) => (
                    <a href={isSafeHttpUrl(href as string) ? href : '#'} target="_blank" rel="noopener noreferrer" className="text-sky-300 hover:text-sky-200 underline underline-offset-2" {...props}>{children}</a>
                  ),
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const [copied, setCopied] = React.useState(false);
                    return match ? (
                      <div className="relative my-6 rounded-lg bg-[#181c24] border border-cyan-900/40 overflow-x-auto max-w-full">
                        <button onClick={() => { navigator.clipboard.writeText(String(children)); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="absolute top-0 right-0 m-1 p-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md shadow transition-all duration-200" title="Copy" type="button">{copied ? (<Check className="w-3 h-3" />) : (<Copy className="w-3 h-3" />)}</button>
                        <div className="px-3 py-3 bg-[#10141a] border-b border-cyan-900/20 rounded-t-lg" />
                        <SyntaxHighlighter language={match[1]} style={{ ...oneDark, 'pre[class*="language-"]': { ...(oneDark as any)['pre[class*="language-"]'], margin: 0 } }} customStyle={{ margin: 0, padding: '1.1rem 1rem 1rem 1rem', fontSize: '1rem', borderRadius: 0, minWidth: '100%' }} wrapLines lineProps={{ style: { whiteSpace: 'pre', wordBreak: 'normal' } }}>{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-[#23272f] text-cyan-300 rounded px-1 font-mono" {...props}>{children}</code>
                    );
                  },
                  img: ({ node, ...props }) => {
                    const src = isAllowedImageSrc(props.src as string) ? props.src : '';
                    const isZoomed = selectedImage === src;
                    if (!src) {
                      return (<span className="text-red-400 italic">[blocked image: not allowed by policy]</span>);
                    }
                    return (
                      <img {...props} src={src} onClick={() => setSelectedImage(isZoomed ? null : src)} className={`transition-transform duration-300 cursor-pointer rounded-md shadow-md ${isZoomed ? 'scale-150 z-10 relative' : 'scale-100'}`} style={{ maxWidth: '100%', height: 'auto', margin: '1rem 0' }} alt={props.alt || ''} loading="lazy" decoding="async" />
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            )}
          </article>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.3}>
          <div className="mt-8 sm:mt-12 md:mt-16 text-center">
            <a href="/blog" className="inline-block mt-6 px-8 py-3 border-2 border-sky-400/50 rounded-lg font-mono text-lg hover:bg-sky-500/20 hover:border-white hover:text-white transition duration-300 cursor-pointer">← Back to Blog List</a>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default BlogDetails;
