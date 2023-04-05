import { generateToken } from '@/utils/generate-token';
import corsMiddleware from '@/middlewares/cors';

export default async function handler(req, res) {
  try {
    await corsMiddleware(req, res);

    const token = await generateToken();
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}
