import Google from "@auth/core/providers/google";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { convexAuth } from "@convex-dev/auth/server";
import { v4 as uuidV4 } from "uuid";

import getRandomSciFiMythicalName from "@/utils/random-name-generator";

import { MutationCtx } from "./_generated/server";
import { findUserByEmail } from "./users";

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

      // Check if this is an SSO login (not anonymous)
      if (args.provider.id !== "anonymous" && args.profile.email) {
        // Check for existing authenticated user with this email
        const existingUser = await findUserByEmail(
          ctx,
          args.profile.email as string
        );
        
        console.log("Existing user found:", existingUser);
        
        // If user exists and is not anonymous, return it
        if (existingUser && !existingUser.isAnonymous) {
          return existingUser._id;
        }
        
        // For anonymous users, we'll handle the migration separately
        // Just create the new authenticated user here
      }

      console.log("Creating a new user in the database.");

      // Create new user (either anonymous or authenticated)
      return ctx.db.insert("users", {
        id: uuidV4(),
        name: (args.profile.name as string) ?? getRandomSciFiMythicalName(),
        email: args.profile.email,
        image:
          (args.profile.image as string) ??
          "https://wallpapers.com/images/hd/confused-patrick-random-pfp-x63wp9vs43cem64s.jpg",
        emailVerificationTime: args.profile.email ? Date.now() : undefined,
        phone: args.profile.phone,
        phoneVerificationTime: args.profile.phone ? Date.now() : undefined,
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
  },
});
