type AuthUser = {
  id: string;
  email: string;
};

export type AuthContext = {
  Variables: {
    user: AuthUser;
  };
};
