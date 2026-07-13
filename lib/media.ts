// Client- and server-safe media helpers (no server-only imports).

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v"];

/**
 * Detects whether a stored media URL points to a video based on its extension.
 * Blob's `addRandomSuffix` preserves the original file extension, so matching
 * on the pathname is reliable.
 */
export function isVideoUrl(url: string): boolean {
  let pathname = url;
  try {
    pathname = new URL(url).pathname;
  } catch {
    // Not an absolute URL; fall back to the raw string.
  }
  const lower = pathname.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function isVideoFile(file: File): boolean {
  return file.type.startsWith("video/");
}
