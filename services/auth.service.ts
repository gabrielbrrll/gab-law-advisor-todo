import { generateToken } from '../helpers/jwt.helper';
import { comparePassword } from '../helpers/bcrypt.helper';
import { findUserByUsername } from './user.service';
import config from '../config/config';

export async function loginUser(username: string, password: string): Promise<string | null> {
  const user = await findUserByUsername(username);
  if (!user) return null;

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) return null;

  const userPayload = {
    id: user.id,
    username: user.username
  };

  const token = generateToken(userPayload, config.jwt.secret!, {
    expiresIn: '1h'
  });

  return token;
}
