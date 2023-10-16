import jwt from 'jsonwebtoken';

export function generateToken(payload: any, secret: string, options?: jwt.SignOptions): string {
  return jwt.sign(payload, secret, options);
}
