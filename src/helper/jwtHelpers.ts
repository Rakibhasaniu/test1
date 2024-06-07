import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const createToken = (payload: any, secret: Secret, expiresIn: string) => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });
  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  const decoded = jwt.verify(token, secret) as JwtPayload;
  return decoded;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
