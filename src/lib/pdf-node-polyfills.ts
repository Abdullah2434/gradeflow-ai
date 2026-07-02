/**
 * pdfjs-dist (used by pdf-parse) expects browser canvas APIs. In Node it tries
 * createRequire(import.meta.url) to load @napi-rs/canvas, which fails under
 * Next.js externalized server bundles — DOMMatrix is then undefined at import.
 */
let polyfilled = false;

export async function ensurePdfNodePolyfills(): Promise<void> {
  if (polyfilled || typeof globalThis.DOMMatrix !== "undefined") {
    polyfilled = true;
    return;
  }

  const canvas = await import("@napi-rs/canvas");
  globalThis.DOMMatrix = canvas.DOMMatrix as typeof DOMMatrix;
  globalThis.ImageData = canvas.ImageData as unknown as typeof ImageData;
  globalThis.Path2D = canvas.Path2D as typeof Path2D;
  polyfilled = true;
}
