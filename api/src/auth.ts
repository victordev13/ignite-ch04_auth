import jwt from 'jsonwebtoken'

import { auth } from './config';
import { createRefreshToken } from './database';

export function generateJwtAndRefreshToken(email: string, payload: object = {}) {
  const token = jwt.sign(payload, auth.secret, {
    subject: email,
    expiresIn: 10, // 5 seconds, only for test
  });

  const refreshToken = createRefreshToken(email)

  return {
    token,
    refreshToken,
  }
}
