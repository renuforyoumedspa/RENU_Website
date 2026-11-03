import Image from 'next/image';
import type { GalleryTile } from '@/sanity/lib/queries';
import { imageSrc } from '@/sanity/lib/image';

// Staggered photo + review gallery. Shared by the homepage's "What patients
// are saying" teaser (first few tiles) and the full /gallery page (all of
// them), so both render tiles identically.
export default function GalleryMasonry({ tiles }: { tiles: GalleryTile[] }) {
  return (
    <div className="gallery-masonry">
      {tiles.map((tile) => {
        if (tile.kind === 'photo') {
          const src = imageSrc(tile.image);
          // "Full photo" tiles take the photo's own proportions, so
          // side-by-side before & afters are never cropped.
          const ratio = tile.shape === 'full' && tile.dims ? { aspectRatio: `${tile.dims.width} / ${tile.dims.height}` } : undefined;
          return (
            <div className={`gallery-tile gallery-tile--photo gallery-tile--${tile.shape}`} style={ratio} key={tile._id}>
              {src && <Image src={src} alt={tile.alt} fill sizes="(min-width: 1080px) 25vw, (min-width: 640px) 33vw, 90vw" />}
            </div>
          );
        }
        return (
          <article className="gallery-tile gallery-tile--review" key={tile._id}>
            <div className="gallery-tile__stars" aria-label="5 out of 5 stars">★★★★★</div>
            <p className="gallery-tile__quote">&quot;{tile.quote}&quot;</p>
            <div className="gallery-tile__author">
              <strong>{tile.reviewerName}</strong>
              <span>{tile.source}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
