export const getAuthConfig = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return {
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: "7d",
    },
    bcrypt: {
      saltRounds: 10,
    },
  };
};
