// Browser-side image compression using Canvas API — no external package needed.
// Converts any image to WebP and resizes before it hits the server.

type Preset = "product" | "thumbnail" | "proof";

const PRESETS: Record<Preset, { maxW: number; maxH: number; quality: number }> = {
  product:   { maxW: 1200, maxH: 1200, quality: 0.72 },
  thumbnail: { maxW: 400,  maxH: 400,  quality: 0.70 },
  proof:     { maxW: 1920, maxH: 1920, quality: 0.75 },
};

export async function compressImage(file: File, preset: Preset = "product"): Promise<File> {
  const { maxW, maxH, quality } = PRESETS[preset];

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let w = img.naturalWidth;
      let h = img.naturalHeight;

      if (w > maxW || h > maxH) {
        const ratio = Math.min(maxW / w, maxH / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(file); return; }
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          const compressed = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, ".webp"),
            { type: "image/webp" }
          );
          // Only use compressed version if it's actually smaller
          resolve(compressed.size < file.size ? compressed : file);
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
    img.src = objectUrl;
  });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
