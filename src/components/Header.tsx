'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const NAV_ITEMS = [
  { id: 'treatments', label: 'Treatments', href: '/treatments/' },
  { id: 'quiz', label: 'Find My Treatment', href: '/find-my-treatment/' },
  { id: 'shop', label: 'Shop', href: '/shop/' },
  {
    id: 'practice',
    label: 'Our Practice',
    href: '#', // unused (rendered as a button, not a link) — present only so every item shares a consistent shape for TS narrowing
    drop: true,
    children: [
      { id: 'about', label: 'About the Practice', href: '/about/' },
      { id: 'team', label: 'Meet the Team', href: '/about/#team' },
      { id: 'blog', label: 'Blog', href: '/blog/' },
      { id: 'financing', label: 'Financing', href: '/financing/' },
      { id: 'privacy', label: 'Privacy Policy', href: '/privacy/' }
    ]
  },
  { id: 'contact', label: 'Contact Us', href: '/contact/' }
] as const;

function activeIdFromPath(pathname: string): string {
  if (pathname.startsWith('/treatments')) return 'treatments';
  if (pathname.startsWith('/find-my-treatment')) return 'quiz';
  if (pathname.startsWith('/shop')) return 'shop';
  if (pathname.startsWith('/about')) return 'about';
  if (pathname.startsWith('/blog')) return 'blog';
  if (pathname.startsWith('/financing')) return 'financing';
  if (pathname.startsWith('/privacy')) return 'privacy';
  if (pathname.startsWith('/contact')) return 'contact';
  return '';
}

export default function Header() {
  const pathname = usePathname();
  const activeId = activeIdFromPath(pathname);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePracticeOpen, setMobilePracticeOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sticky-offset CSS var for other pages' sticky elements (filter bar,
  // treatment detail's booking aside) to read, since we can't know the
  // header's real rendered height in advance.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const setVar = () => document.documentElement.style.setProperty('--chrome-header-h', `${header.getBoundingClientRect().height}px`);
    setVar();
    window.addEventListener('resize', setVar);
    const ro = new ResizeObserver(setVar);
    ro.observe(header);
    return () => {
      window.removeEventListener('resize', setVar);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setDropdownOpen(false);
    }
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  function isActive(item: (typeof NAV_ITEMS)[number]) {
    return item.id === activeId || ('children' in item && item.children.some((c) => c.id === activeId));
  }

  return (
    <>
      <div className="chrome-utility">
        <span>Stuart &amp; Tequesta, FL</span>
        <a href="tel:5614066123">561-406-6123</a>
        <Link href="/find-my-treatment/" className="chrome-utility__quiz-link">60-second skin assessment</Link>
      </div>

      <header className="chrome-header" id="chrome-header" ref={headerRef}>
        <Link href="/" className="chrome-logo" aria-label="RENU Medical Aesthetics — home">
          <Image src="/assets/renu-logo.png" alt="RENU Medical Aesthetics" width={168} height={42} priority />
        </Link>

        <nav className="chrome-nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <div className="chrome-nav__item" key={item.id} ref={item.id === 'practice' ? dropdownRef : undefined}>
              {'drop' in item && item.drop ? (
                <>
                  <button
                    type="button"
                    className={`chrome-nav__link${isActive(item) ? ' is-active' : ''}`}
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                    onClick={() => setDropdownOpen((v) => !v)}
                  >
                    {item.label} <span className="chrome-caret" aria-hidden="true">⌄</span>
                  </button>
                  <div className="chrome-dropdown" data-open={dropdownOpen} role="menu">
                    {item.children.map((c) => (
                      <Link key={c.id} href={c.href} className="chrome-dropdown__item" role="menuitem" onClick={() => setDropdownOpen(false)}>
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link href={item.href} className={`chrome-nav__link${isActive(item) ? ' is-active' : ''}`}>
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="chrome-header__actions">
          <Link href="/find-my-treatment/" className="btn btn--pill-outline chrome-find-pill">Find My Treatment</Link>
          <Link href="/book/" className="btn btn--pill-primary chrome-book-pill">Book Now</Link>
          <button
            type="button"
            className="chrome-hamburger"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <nav className="chrome-mobile-nav" data-open={mobileOpen} aria-label="Mobile">
        {NAV_ITEMS.map((item) => (
          <div className={`chrome-mobile-nav__group${'drop' in item && item.drop && mobilePracticeOpen ? ' is-open' : ''}`} key={item.id}>
            {'drop' in item && item.drop ? (
              <a
                href="#"
                className={`chrome-mobile-nav__link${isActive(item) ? ' is-active' : ''}`}
                onClick={(e) => { e.preventDefault(); setMobilePracticeOpen((v) => !v); }}
              >
                {item.label}
              </a>
            ) : (
              <Link href={item.href} className={`chrome-mobile-nav__link${isActive(item) ? ' is-active' : ''}`} onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            )}
            {'children' in item && (
              <div className="chrome-mobile-nav__children">
                {item.children.map((c) => (
                  <Link key={c.id} href={c.href} className="chrome-mobile-nav__child" onClick={() => setMobileOpen(false)}>
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <Link href="/find-my-treatment/" className="btn btn--pill-outline chrome-mobile-nav__cta" onClick={() => setMobileOpen(false)}>
          Find My Treatment
        </Link>
      </nav>
    </>
  );
}
