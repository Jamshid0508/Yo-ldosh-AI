export function downloadSvgAsPng(svg: SVGSVGElement, filename: string, scale = 2): Promise<void> {
  return new Promise((resolve, reject) => {
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const viewBox = svg.viewBox.baseVal;
      const w = (viewBox && viewBox.width) || svg.clientWidth || 320;
      const h = (viewBox && viewBox.height) || svg.clientHeight || 320;
      const canvas = document.createElement("canvas");
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error("Canvas mavjud emas"));
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
      resolve();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Sxemani rasmga aylantirib bo'lmadi"));
    };
    img.src = url;
  });
}
