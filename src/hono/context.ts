import { decode, type JWT } from "next-auth/jwt";
export interface JWTPayload extends JWT {
  id?: string;
  email?: string | null;
}

type AuthUser = {
  id: string;
  email: string;
};

export type AuthContext = {
  Variables: {
    user: AuthUser;
    jwtPayload: JWTPayload;
  };
};
