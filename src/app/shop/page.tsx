import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllProducts } from '@/sanity/lib/queries';

export const metadata: Metadata = {
  title: 'Shop Skincare',
  description: 'Medical-grade skincare from RENU Medical Aesthetics.',
  alternates: { canonical: '/shop/' }
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <>
      <section className="page-header">
        <div className="page-header__inner">
          <span className="page-header__eyebrow">Shop</span>
          <h1 className="page-header__title">Medical-grade skincare, same shelf as the clinic.</h1>
          <p className="page-header__lead">Everyday maintenance and post-treatment care from the brands Dr. Barrett actually recommends. Prescription-strength lines are dispensed after a consultation, not sold online.</p>
          <div className="shop-brand-chips">
            <span className="shop-brand-chip">ZO Skin Health</span>
            <span className="shop-brand-chip">Neocutis</span>
            <span className="shop-brand-chip">Alastin</span>
            <span className="shop-brand-chip">EltaMD</span>
            <span className="shop-brand-chip">RENU Post-Care</span>
          </div>
        </div>
      </section>

      <div className="shop-grid">
        {products.map((p) => (
          <article className="shop-card" key={p._id}>
            <div className="shop-card__media"></div>
            <div className="shop-card__body">
              <span className="shop-card__brand">{p.brand}</span>
              <h3 className="shop-card__name">{p.name}</h3>
              <p className="shop-card__note">{p.note}</p>
              <div className="shop-card__bottom">
                <span className="shop-card__price">{p.price}</span>
                {p.buyUrl ? (
                  <a href={p.buyUrl} target="_blank" rel="noopener" className="btn btn--primary shop-card__buy">Buy</a>
                ) : (
                  <span className="btn btn--primary shop-card__buy" style={{ opacity: 0.5, cursor: 'default' }} aria-disabled="true">Buy</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="shop-crosssell">
        <div className="shop-crosssell__text">
          <strong>Not sure which regimen?</strong>
          <span>The assessment points you toward the right treatments — ask at your consult for product recommendations to match.</span>
        </div>
        <Link href="/find-my-treatment/" className="btn btn--secondary">Take the assessment</Link>
      </div>
    </>
  );
}
