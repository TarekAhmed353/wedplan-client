import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";
import { getPasswordError } from "@/lib/password-rules";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not set. Add it to the .env.local file.");
}

const client = new MongoClient(uri);
const db = client.db(process.env.DB_NAME || "wedplan");

const signUpRoles = ["customer", "vendor"];

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      businessName: {
        type: "string",
        required: false,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session, context) => {
          const user = (await context?.context.internalAdapter.findUserById(
            session.userId,
          )) as { isBlocked?: boolean } | null | undefined;

          if (user?.isBlocked) {
            throw APIError.fromStatus("FORBIDDEN", {
              message: "Your account is blocked. Please contact support.",
            });
          }
        },
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const { role, password, businessName } = ctx.body ?? {};

        if (!signUpRoles.includes(role)) {
          throw APIError.fromStatus("BAD_REQUEST", {
            message: "Please choose customer or vendor as your role.",
          });
        }

        const passwordError =
          typeof password === "string"
            ? getPasswordError(password)
            : "Password is required.";

        if (passwordError) {
          throw APIError.fromStatus("BAD_REQUEST", { message: passwordError });
        }

        if (
          businessName !== undefined &&
          (typeof businessName !== "string" || businessName.length > 80)
        ) {
          throw APIError.fromStatus("BAD_REQUEST", {
            message: "Business name must be text of 80 characters or less.",
          });
        }
      }

      if (ctx.path === "/update-user" && ctx.body && "role" in ctx.body) {
        throw APIError.fromStatus("FORBIDDEN", {
          message: "You cannot change your role.",
        });
      }
    }),
  },
  plugins: [nextCookies()],
});
