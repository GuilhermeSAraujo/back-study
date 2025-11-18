import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { authGoogleJsonInput } from "./auth.input";
import { jsonValidator } from "../middleware/validator";
import { db } from "../database/db";
import { authUsers } from "../database/schemas/auth-users";
import { userQuota } from "../database/schemas/user-quota";
import { Quota } from "../domain/quota";

export const authRoute = new Hono().post(
  "/google",
  jsonValidator(authGoogleJsonInput),
  async (c) => {
    const { email, name, googleId, profilePicture } = c.req.valid("json");
    console.log({ email, name, googleId, profilePicture });

    const user = await db.query.authUsers.findFirst({
      where: and(eq(authUsers.googleId, googleId), eq(authUsers.email, email)),
    });

    if (user) {
      return c.json(user);
    }

    const [newUser] = await db
      .insert(authUsers)
      .values({
        email,
        name,
        googleId,
        image: profilePicture,
      })
      .returning();

    await db.insert(userQuota).values({
      userId: newUser.id,
      purchased: Quota.FREE,
      consumed: 0,
    });

    return c.json(newUser);
  }
);
