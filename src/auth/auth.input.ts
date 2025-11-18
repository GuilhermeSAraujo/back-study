import z4 from "zod/v4";

export const authGoogleJsonInput = z4.object({
  email: z4.email(),
  name: z4.string(),
  googleId: z4.string(),
  profilePicture: z4.string(),
});
