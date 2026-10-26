import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from './api.js';
import { SafeImage } from './components/SafeImage.jsx';

const DEFAULT_PROPERTY_IMAGE = '/images/property-placeholder.svg';

export function ListingCard({ listing, onRemove }) {
  const imageCandidates = [
    listing.imageUrl,
    listing.image,
    ...(Array.isArray(listing.imageUrls) ? listing.imageUrls : []),
    ...(Array.isArray(listing.images) ? listing.images : []),
  ].filter((value, index, all) => typeof value === 'string' && value.trim() && value !== DEFAULT_PROPERTY_IMAGE && all.indexOf(value) === index);
  const imageSources = [...imageCandidates, DEFAULT_PROPERTY_IMAGE];
  const [imageIndex, setImageIndex] = useState(0);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    setImageIndex(0);
    setShowFallback(false);
  }, [listing.id, listing.imageUrl, listing.image, listing.imageUrls, listing.images]);

  function handleImageUnavailable() {
    if (imageIndex < imageSources.length - 1) {
      setImageIndex((current) => current + 1);
    } else {
      setShowFallback(true);
    }
  }
  const imageSrc = imageSources[imageIndex] || DEFAULT_PROPERTY_IMAGE;
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-sand bg-white shadow-sm transition-shadow [@media(hover:hover)]:hover:shadow-md">
      <Link to={`/listings/${listing.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-sand">
          {showFallback ? <div className="flex h-full w-full items-center justify-center bg-sand text-sm text-ink/45">Photo unavailable</div> : <SafeImage src={imageSrc} alt={listing.title} className="h-full w-full object-cover transition-transform duration-300 [@media(hover:hover)]:group-hover:scale-[1.03]" fallback={null} onUnavailable={handleImageUnavailable} />}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-forest shadow-sm backdrop-blur">
              {listing.listingType === 'rent' ? 'For rent' : 'For sale'}
            </span>
            {listing.featured ? (
              <span className="rounded-full bg-forest px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-cream shadow-sm">
                Featured
              </span>
            ) : null}
            {listing.status && listing.status !== 'available' ? (
              <span className="rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {listing.status}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <div className="space-y-1">
            <p className="font-serif text-xl font-medium text-forest">{formatPrice(listing)}</p>
            <h3 className="line-clamp-2 font-medium leading-snug text-ink [@media(hover:hover)]:group-hover:text-forest transition-colors">
              {listing.title}
            </h3>
            <p className="text-sm text-ink/60">
              {listing.city}, {listing.state}
            </p>
          </div>
          <p className="mt-3 text-sm text-ink/70">
            {listing.bedrooms} bd · {listing.bathrooms} ba · {listing.areaSqft ? `${listing.areaSqft.toLocaleString()} sqft` : 'N/A'}
          </p>
        </div>
      </Link>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(listing.id);
          }}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-ink/70 hover:text-red-700 hover:bg-white shadow-sm transition-colors"
          title="Remove from saved"
        >
          <svg className="h-4 w-4 fill-current text-red-600" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, body }) {
  return (
    <div className="rounded-2xl border border-dashed border-forest/20 bg-white px-6 py-16 text-center">
      <p className="font-serif text-2xl text-forest">{title}</p>
      {body && <p className="mt-2 text-ink/60">{body}</p>}
    </div>
  );
}
