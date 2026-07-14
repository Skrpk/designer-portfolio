"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./ImageGallery.module.css";

export default function ImageGallery({
  images,
  projectName,
}: {
  images: string[];
  projectName: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(() => {
    setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
  }, [images.length]);
  const showNext = useCallback(() => {
    setOpenIndex((i) => (i === null ? i : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    }

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, showPrev, showNext]);

  return (
    <>
      <ul className={styles.grid}>
        {images.map((src, i) => (
          <li key={src} className={styles.item}>
            <button
              type="button"
              className={styles.trigger}
              onClick={() => setOpenIndex(i)}
              aria-label={`Open image ${i + 1} of ${images.length}`}
            >
              <Image
                src={src}
                alt={`${projectName} — image ${i + 1}`}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={i === 0}
              />
              <span className={styles.overlay} aria-hidden="true">
                <span className={styles.expand}>&#10529;</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {isOpen && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${projectName} image viewer`}
          onClick={close}
        >
          <button
            type="button"
            className={styles.close}
            onClick={close}
            aria-label="Close"
          >
            &times;
          </button>

          {images.length > 1 && (
            <button
              type="button"
              className={`${styles.navBtn} ${styles.prev}`}
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Previous image"
            >
              &#8249;
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[openIndex]}
            alt={`${projectName} — image ${openIndex + 1}`}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              type="button"
              className={`${styles.navBtn} ${styles.next}`}
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Next image"
            >
              &#8250;
            </button>
          )}
        </div>
      )}
    </>
  );
}
