export type CropArea = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export async function getCroppedImage(
  imageSrc: string,
  pixelCrop: CropArea,
  outputType: "image/jpeg" | "image/png" = "image/jpeg",
  quality = 0.9
): Promise<string> {
  const image = new Image();
  image.src = imageSrc;

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL(outputType, quality);
}
