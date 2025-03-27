import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface ImageWithFallbackProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

export function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy'
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '50px 0px'
  });

  return (
    <div ref={ref} className={className}>
      {inView && (
        <img
          src={error ? fallbackSrc : src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          onError={() => setError(true)}
          className={className}
        />
      )}
    </div>
  );
}