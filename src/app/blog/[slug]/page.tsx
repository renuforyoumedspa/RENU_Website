import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { getAllBlogPosts, getBlogPostBySlug } from '@/sanity/lib/queries';
import { imageSrc } from '@/sanity/lib/image';
import { SITE_NAME, abs, breadcrumbJsonLd, jsonLdScript } from '@/lib/seo';

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  const image = imageSrc(post.heroImage);
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `/blog/${post.slug}/`,
      publishedTime: post.pubDate,
      modifiedTime: post._updatedAt,
      tags: post.tags,
      images: image ? [{ url: image, alt: post.title }] : undefined
    }
  };
}

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

// Inline images and links inside a post body. Links to other pages on this
// site stay in the same tab; external links open in a new one.
const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: { alt?: string } }) => {
      const src = imageSrc(value);
      if (!src) return null;
      return (
        <figure className="blog-post__figure">
          <Image src={src} alt={value.alt || ''} width={1200} height={800} sizes="(min-width: 760px) 720px, 100vw" style={{ width: '100%', height: 'auto' }} />
        </figure>
      );
    }
  },
  marks: {
    link: ({ value, children }: { value?: { href?: string }; children: React.ReactNode }) => {
      const href = value?.href || '#';
      return href.startsWith('/') ? <Link href={href}>{children}</Link> : <a href={href} target="_blank" rel="noopener">{children}</a>;
    }
  }
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();
  const heroSrc = imageSrc(post.heroImage);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.pubDate,
    dateModified: post._updatedAt || post.pubDate,
    image: heroSrc ? abs(heroSrc) : undefined,
    keywords: post.tags?.join(', '),
    url: abs(`/blog/${post.slug}/`),
    mainEntityOfPage: abs(`/blog/${post.slug}/`),
    author: { '@type': 'Organization', name: SITE_NAME, url: abs('/') },
    publisher: { '@id': abs('/#organization') }
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog/' },
    { name: post.title, path: `/blog/${post.slug}/` }
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(articleJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbs)} />

      <nav className="detail-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> <span className="detail-breadcrumb__sep">/</span>
        <Link href="/blog/">Blog</Link> <span className="detail-breadcrumb__sep">/</span>
        <span className="detail-breadcrumb__current">{post.title}</span>
      </nav>

      <article className="blog-post">
        <span className="blog-post__date">{dateFmt.format(new Date(post.pubDate))}</span>
        <h1 className="blog-post__title">{post.title}</h1>
        {heroSrc && (
          <figure className="blog-post__figure blog-post__figure--hero">
            <Image src={heroSrc} alt={post.title} width={1200} height={675} priority sizes="(min-width: 760px) 720px, 100vw" style={{ width: '100%', height: 'auto' }} />
          </figure>
        )}
        <div className="detail-treats__prose blog-post__body">
          {post.body ? <PortableText value={post.body as never} components={components} /> : null}
        </div>
        {post.tags && post.tags.length > 0 && (
          <ul className="blog-post__tags" aria-label="Tags">
            {post.tags.map((t) => <li key={t}>{t}</li>)}
          </ul>
        )}
        <Link href="/blog/" className="blog-post__back">← Back to Blog</Link>
      </article>
    </>
  );
}
