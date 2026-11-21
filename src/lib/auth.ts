import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { client, db } from "@/lib/db";
import { getPasswordError } from "@/lib/password-rules";

const signUpRoles = ["customer", "vendor"];

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
      },
      roleChosen: {
        type: "boolean",
        required: false,
        input: false,
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
    user: {
      create: {
        before: async (user, context) => {
          if (context?.path === "/sign-up/email") {
            return { data: { ...user, roleChosen: true } };
          }

          return { data: { ...user, role: "customer", roleChosen: false } };
        },
      },
    },
    session: {
      create: {
        before: async (session, context) => {
          const user = (await context?.context.internalAdapter.findUserById(
            session.userId,
          )) as { isBlocked?: boolean } | null | undefined;

          if (user?.isBlocked) {
            throw APIError.fromStatus("FORBIDDEN", {
              code: "ACCOUNT_BLOCKED",
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
  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({ id: user.id, email: user.email }),
      },
    }),
    nextCookies(),
  ],
});
