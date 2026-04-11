import { useState } from "react";
import { GalleryImage } from "@/lib/gallery-images";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";

interface LeadSiteGalleryProps {
  images: GalleryImage[];
  label: string;
  heading: string;
}

const LeadSiteGallery = ({ images, label, heading }: LeadSiteGalleryProps) => {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const visibleImages = images.slice(0, 12);

  const goNext = () => {
    if (lightbox !== null) setLightbox((lightbox + 1) % visibleImages.length);
  };
  const goPrev = () => {
    if (lightbox !== null) setLightbox((lightbox - 1 + visibleImages.length) % visibleImages.length);
  };

  return (
    <>
      <section className="salon-section">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Camera className="w-4 h-4 text-muted-foreground" />
            <p className="text-muted-foreground uppercase text-xs tracking-[0.2em] font-medium">{label}</p>
          </div>
          <h2 className="salon-heading mb-4">{heading}</h2>
          <div className="gold-divider" />
        </div>

        {/* Google Maps-style mosaic grid */}
        <div className="grid grid-cols-4 gap-1.5 rounded-xl overflow-hidden">
          {/* Large featured image */}
          {visibleImages[0] && (
            <button
              onClick={() => setLightbox(0)}
              className="col-span-2 row-span-2 relative overflow-hidden cursor-pointer group"
            >
              <img
                src={visibleImages[0].src}
                alt={visibleImages[0].alt}
                loading="lazy"
                width={640}
                height={640}
                className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
            </button>
          )}

          {/* Right column - 2 images stacked */}
          {visibleImages.slice(1, 3).map((img, i) => (
            <button
              key={i + 1}
              onClick={() => setLightbox(i + 1)}
              className="relative overflow-hidden cursor-pointer group col-span-2 sm:col-span-1"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                width={320}
                height={320}
                className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
            </button>
          ))}

          {/* Additional right column images */}
          {visibleImages.slice(3, 5).map((img, i) => (
            <button
              key={i + 3}
              onClick={() => setLightbox(i + 3)}
              className="relative overflow-hidden cursor-pointer group col-span-2 sm:col-span-1"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                width={320}
                height={320}
                className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
            </button>
          ))}

          {/* Bottom row - remaining images */}
          {visibleImages.slice(5).map((img, i) => (
            <button
              key={i + 5}
              onClick={() => setLightbox(i + 5)}
              className="relative overflow-hidden cursor-pointer group"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                width={320}
                height={320}
                className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
              {/* Show count badge on last image if more exist */}
              {i + 5 === visibleImages.length - 1 && images.length > visibleImages.length && (
                <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-lg">+{images.length - visibleImages.length}</span>
                </div>
              )}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-3">
          {visibleImages.length} fotos do estabelecimento
        </p>
      </section>

      {/* Lightbox with navigation */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-foreground/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-primary-foreground hover:text-primary-foreground/80 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 text-primary-foreground hover:text-primary-foreground/80 transition-colors z-10"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 text-primary-foreground hover:text-primary-foreground/80 transition-colors z-10"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <img
            src={visibleImages[lightbox].src}
            alt={visibleImages[lightbox].alt}
            className="max-w-full max-h-[85vh] object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 text-primary-foreground text-sm">
            {lightbox + 1} / {visibleImages.length}
          </div>
        </div>
      )}
    </>
  );
};

export default LeadSiteGallery;
