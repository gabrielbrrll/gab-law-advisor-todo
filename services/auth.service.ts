import { generateToken } from '../helpers/jwt.helper';
import { comparePassword } from '../helpers/bcrypt.helper';
import { findUserByUsername } from './user.service';
import config from '../config/config';

/**
 * Logs a user in by verifying their credentials and returns a JWT token if successful.
 *
 * @param {string} username - The username of the user trying to log in.
 * @param {string} password - The raw password provided by the user trying to log in.
 *
 * @returns {Promise<string|null>} A JWT token if the login was successful, otherwise null.
 */
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
