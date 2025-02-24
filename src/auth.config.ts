import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { LoginSchema } from "../schemas";
import { getUserByEmail } from "@/data/user";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("Received credentials:", credentials); // Log credentials
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          console.log("Validated fields:", { email, password }); // Log validated fields

          const user = await getUserByEmail(email);
          console.log("Fetched user:", user); // Log fetched user

          if (!user || !user.password) {
            console.log("User not found or password missing");
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);
          console.log("Password match:", passwordMatch); // Log password match result

          if (passwordMatch) {
            console.log("User authorized:", user); // Log authorized user
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
            };
          }
        }
        console.log("Authorization failed");
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
