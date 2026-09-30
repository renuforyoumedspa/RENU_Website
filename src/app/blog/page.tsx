import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllBlogPosts } from '@/sanity/lib/queries';
import { imageSrc } from '@/sanity/lib/image';

export const metadata: Metadata = {
  title: 'Med Spa Blog: Treatment Guides & Skin Care Tips',
  description: 'Treatment guides, skincare tips, and news from Dr. Barrett and the RENU team.',
  alternates: { canonical: '/blog/' }
};

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();

  return (
    <>
      <section className="page-header">
        <div className="page-header__inner">
          <span className="page-header__eyebrow">From the Practice</span>
          <h1 className="page-header__title">The RENU Blog</h1>
          <p className="page-header__lead">Treatment guides, skincare tips, and news from Dr. Barrett and the RENU team.</p>
        </div>
      </section>

      <div className="blog-grid">
        {posts.map((post) => (
          <article className="blog-card" key={post._id}>
            <Link href={`/blog/${post.slug}/`} className="blog-card__media" aria-hidden="true" tabIndex={-1}>
              {imageSrc(post.heroImage) && <Image src={imageSrc(post.heroImage)!} alt="" fill sizes="(min-width: 1080px) 33vw, (min-width: 620px) 50vw, 90vw" />}
            </Link>
            <div className="blog-card__body">
              <span className="blog-card__date">{dateFmt.format(new Date(post.pubDate))}</span>
              <h3 className="blog-card__title"><Link href={`/blog/${post.slug}/`} style={{ color: 'inherit' }}>{post.title}</Link></h3>
              <p className="blog-card__desc">{post.description}</p>
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="idx-empty" style={{ margin: '0 40px 60px' }}>
          <p>No posts published yet — check back soon.</p>
        </div>
      )}
    </>
  );
}
