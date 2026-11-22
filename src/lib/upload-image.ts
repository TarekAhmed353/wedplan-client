export type UploadPurpose = "profile" | "service";

export async function uploadImage(file: File, purpose: UploadPurpose) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("purpose", purpose);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const result = await response.json().catch(() => null);

  if (!response.ok || typeof result?.url !== "string") {
    throw new Error(result?.message || "Image upload failed. Please try again.");
  }

  return result.url as string;
}
