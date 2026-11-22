import { auth } from "@/lib/auth";
import { getImageError } from "@/lib/image-rules";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json(
      { message: "Please sign in to upload images." },
      { status: 401 },
    );
  }

  if (session.user.isBlocked) {
    return Response.json(
      { message: "Your account is blocked." },
      { status: 403 },
    );
  }

  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    return Response.json(
      { message: "Image upload is not set up yet." },
      { status: 500 },
    );
  }

  const formData = await request.formData().catch(() => null);
  const purpose = formData?.get("purpose");
  const file = formData?.get("image");

  if (purpose !== "profile" && purpose !== "service") {
    return Response.json(
      { message: "Upload purpose must be profile or service." },
      { status: 400 },
    );
  }

  if (
    purpose === "service" &&
    (session.user.role !== "vendor" || session.user.roleChosen === false)
  ) {
    return Response.json(
      { message: "Only vendors can upload service photos." },
      { status: 403 },
    );
  }

  if (!(file instanceof File)) {
    return Response.json(
      { message: "Please choose an image to upload." },
      { status: 400 },
    );
  }

  const imageError = getImageError(file);

  if (imageError) {
    return Response.json({ message: imageError }, { status: 400 });
  }

  const imgbbData = new FormData();
  imgbbData.append("image", file);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      { method: "POST", body: imgbbData },
    );
    const result = await response.json();

    if (!response.ok || !result?.data?.url) {
      throw new Error("ImgBB did not return an image URL");
    }

    return Response.json({ url: result.data.url });
  } catch {
    return Response.json(
      { message: "Image upload failed. Please try again." },
      { status: 502 },
    );
  }
}
