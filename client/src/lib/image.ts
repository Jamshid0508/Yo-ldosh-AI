/** Rasmni 1280px gacha kichraytirib, base64 (data URL'siz) va media-type qaytaradi. */
export function resizeImageToBase64(
  file: File,
  maxSize = 1280
): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Faylni o'qib bo'lmadi"));
    reader.onload = () => {
      img.onerror = () => reject(new Error("Rasmni ochib bo'lmadi"));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          const scale = maxSize / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas mavjud emas"));
        ctx.drawImage(img, 0, 0, width, height);
        const mediaType = "image/jpeg";
        const dataUrl = canvas.toDataURL(mediaType, 0.85);
        resolve({ base64: dataUrl.split(",")[1], mediaType });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
