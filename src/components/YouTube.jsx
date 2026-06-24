import React from 'react';

/**
 * Responsive 16:9 YouTube embed.
 *
 * Registered globally in src/theme/MDXComponents.js, so it can be used in any
 * .md / .mdx page without an import:
 *
 *   <YouTube id="5UdT3G2Kmx0" title="First app setup" />
 *
 * Props:
 *  - id        (required) the YouTube video id (the part after `v=`)
 *  - title     (optional) accessible iframe title
 *  - start     (optional) start time in seconds
 */
export default function YouTube({id, title = 'YouTube video', start}) {
  const src =
    `https://www.youtube-nocookie.com/embed/${id}` +
    (start ? `?start=${start}` : '');

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%', // 16:9
        margin: '1.5rem 0',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 0,
        }}
      />
    </div>
  );
}
