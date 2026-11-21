export const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export const maxImageSize = 2 * 1024 * 1024;

export function getImageError(file: File) {
  if (!allowedImageTypes.includes(file.type)) {
    return "Please choose a JPG, PNG or WebP image.";
  }

  if (file.size > maxImageSize) {
    return "Image must be 2 MB or smaller.";
  }

  return null;
}
