import jwt from 'jsonwebtoken';

interface Payload {
  id: string;
  email: string;
}

const createJWT = (payload: Payload) => {
  const token = jwt.sign(payload, process.env.JWT_KEY!, {
    expiresIn: 1 * 60,
  });
  return token;
};

const verifyJWT = (token: string) => {
  const decoded = jwt.verify(token, process.env.JWT_KEY!);
  return decoded;
};

export { createJWT, verifyJWT };
