// utils/generate-token.js

import { v4 as uuidv4 } from 'uuid';

// Store the token in an in-memory object
const tokenData = {};

export function generateToken() {
  const now = Date.now();
  const INTERVAL = 1 * 10 * 1000; // 10 second intervals

  // Check if the token is already in memory and hasn't expired
  if (tokenData.token && now - tokenData.lastGenerated < INTERVAL) {
    return tokenData.token;
  }

  // Generate a new token
  const newToken = uuidv4();
  tokenData.token = newToken;
  tokenData.lastGenerated = now;

  return newToken;
}
