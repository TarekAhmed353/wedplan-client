import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const allowedRoles = ["customer", "vendor"];

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json(
      { message: "Please sign in first." },
      { status: 401 },
    );
  }

  if (session.user.isBlocked) {
    return Response.json(
      { message: "Your account is blocked." },
      { status: 403 },
    );
  }

  if (session.user.roleChosen !== false) {
    return Response.json(
      { message: "You have already chosen your role." },
      { status: 409 },
    );
  }

  const body = await request.json().catch(() => null);
  const role = body?.role;
  const businessName =
    typeof body?.businessName === "string" ? body.businessName.trim() : "";

  if (!allowedRoles.includes(role)) {
    return Response.json(
      { message: "Please choose customer or vendor." },
      { status: 400 },
    );
  }

  if (businessName.length > 80) {
    return Response.json(
      { message: "Business name must be 80 characters or less." },
      { status: 400 },
    );
  }

  if (!ObjectId.isValid(session.user.id)) {
    return Response.json(
      { message: "Your account could not be found." },
      { status: 404 },
    );
  }

  const result = await db.collection("user").updateOne(
    { _id: new ObjectId(session.user.id), roleChosen: false },
    {
      $set: {
        role,
        roleChosen: true,
        updatedAt: new Date(),
        ...(role === "vendor" && businessName ? { businessName } : {}),
      },
    },
  );

  if (result.matchedCount === 0) {
    return Response.json(
      { message: "You have already chosen your role." },
      { status: 409 },
    );
  }

  return Response.json({ role });
}
