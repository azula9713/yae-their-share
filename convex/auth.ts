import { convexAuth } from "@convex-dev/auth/server";
import { MutationCtx } from "./_generated/server";
import Google from "@auth/core/providers/google";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { v4 as uuidV4 } from "uuid";
import { findUserByEmail } from "./users";
import getRandomSciFiMythicalName from "@/utils/random-name-generator";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google, Anonymous],
  callbacks: {
    // `args.type` is one of "oauth" | "email" | "phone" | "credentials" | "verification"
    // `args.provider` is the currently used provider config
    async createOrUpdateUser(ctx: MutationCtx, args) {
      console.log("createOrUpdateUser called with args:", args);
      if (args.existingUserId) {
        console.log("Updating existing user with ID:", args.existingUserId);
        // Optionally merge updated fields into the existing user object here
        return args.existingUserId;
      }
      console.log("Creating new user with profile:", args.profile);

      const existingUser = await findUserByEmail(
        ctx,
        args.profile.email as string
      );
      console.log("Existing user found:", existingUser);
      if (existingUser && !existingUser.isAnonymous) return existingUser._id;
      console.log("User not found, creating a new user in the database.");

      // Implementing own user creation with custom id:
      return ctx.db.insert("users", {
        id: uuidV4(),
        name: (args.profile.name as string) ?? getRandomSciFiMythicalName(),
        email: args.profile.email,
        image:
          (args.profile.image as string) ??
          "https://wallpapers.com/images/hd/confused-patrick-random-pfp-x63wp9vs43cem64s.jpg",
        emailVerificationTime: Date.now(),
        phone: args.profile.phone,
        phoneVerificationTime: Date.now(),
        isAnonymous: args.provider.id === "anonymous",
        settings: {
          currency: {
            code: "USD",
            symbol: "$",
            currencyName: "US Dollar",
            countryName: "United States",
            decimalPlaces: 2,
            displayCents: true,
          },
          privacy: {
            shareAnalytics: true,
            autoBackup: true,
          },
          display: {
            compactMode: false,
            theme: "system",
          },
        },
      });
    },

    // async afterUserCreatedOrUpdated(ctx, args) {}
  },
});
