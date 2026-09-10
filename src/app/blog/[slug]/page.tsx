import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import { getAllBlogPosts, getBlogPostBySlug } from '@/sanity/lib/queries';

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: { title: post.title, description: post.description, type: 'article', publishedTime: post.pubDate }
  };
}

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <nav className="detail-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> <span className="detail-breadcrumb__sep">/</span>
        <Link href="/blog/">Blog</Link> <span className="detail-breadcrumb__sep">/</span>
        <span className="detail-breadcrumb__current">{post.title}</span>
      </nav>

      <article className="blog-post">
        <span className="blog-post__date">{dateFmt.format(new Date(post.pubDate))}</span>
        <h1 className="blog-post__title">{post.title}</h1>
        <div className="detail-treats__prose">
          {post.body ? <PortableText value={post.body as never} /> : null}
        </div>
        <Link href="/blog/" className="blog-post__back">← Back to Blog</Link>
      </article>
    </>
  );
}
