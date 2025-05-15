import jwt, { JwtPayload } from "jsonwebtoken";

export const generateJWT = (payload: JwtPayload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

export const verifyToken = (token: string):JwtPayload => {

  const result = jwt.verify(token, process.env.JWT_SECRET,{ complete: true });

  return result;
};
