import { convexAuth } from "@convex-dev/auth/server";
import { MutationCtx } from "./_generated/server";
import Google from "@auth/core/providers/google";
import { v4 as uuidV4 } from "uuid";
import { findUserByEmail } from "./users";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
  callbacks: {
    // `args.type` is one of "oauth" | "email" | "phone" | "credentials" | "verification"
    // `args.provider` is the currently used provider config
    async createOrUpdateUser(ctx: MutationCtx, args) {
      if (args.existingUserId) {
        // Optionally merge updated fields into the existing user object here
        return args.existingUserId;
      }

      const existingUser = await findUserByEmail(
        ctx,
        args.profile.email as string
      );
      if (existingUser) return existingUser._id;

      // Implementing own user creation with custom id:
      return ctx.db.insert("users", {
        id: uuidV4(),
        name: args.profile.name as string | undefined,
        email: args.profile.email,
        image: args.profile.image as string | undefined,
        emailVerificationTime: Date.now(),
        phone: args.profile.phone,
        phoneVerificationTime: Date.now(),
        isAnonymous: false,
      });
    },
  },
});
