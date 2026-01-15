import { useEffect, useState } from 'react';

const MediaLightbox = ({ isOpen, onClose, mediaItems = [], initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
      if (event.key === 'ArrowRight') {
        if (mediaItems.length > 1) {
          setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
        }
      }
      if (event.key === 'ArrowLeft') {
        if (mediaItems.length > 1) {
          setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, mediaItems.length]);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  if (!isOpen) return null;
  if (!mediaItems.length) return null;

  const media = mediaItems[currentIndex];

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (event) => {
    const touch = event.changedTouches[0];
    if (!touch || !touchStart || mediaItems.length <= 1) return;
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    const next = deltaX < 0
      ? (currentIndex + 1) % mediaItems.length
      : (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    setCurrentIndex(next);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-4xl rounded-2xl bg-black shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 text-white">
          <span className="text-sm font-semibold">
            {media?.title || 'Preview'} {mediaItems.length > 1 ? `(${currentIndex + 1}/${mediaItems.length})` : ''}
          </span>
          <button
            className="rounded-full px-3 py-1 text-xs font-semibold text-white/80 hover:text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div
          className="relative w-full overflow-hidden rounded-b-2xl bg-black"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {media?.type === 'image' && (
            <img src={media.url} alt={media.title || 'Product'} className="w-full max-h-[70vh] object-contain" />
          )}
          {media?.type === 'video' && media.provider !== 'mp4' && (
            <iframe
              title={media.title || 'Product video'}
              src={media.embedUrl}
              className="w-full h-[70vh]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          )}
          {media?.type === 'video' && media.provider === 'mp4' && (
            <video controls preload="metadata" className="w-full max-h-[70vh]">
              <source src={media.embedUrl} type="video/mp4" />
            </video>
          )}
          {mediaItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
                aria-label="Previous media"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % mediaItems.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
                aria-label="Next media"
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaLightbox;
