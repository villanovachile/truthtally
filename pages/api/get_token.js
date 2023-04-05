import { generateToken } from '@/utils/generate-token';

export default async function handler(req, res) {
  try {
    const token = await generateToken();
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}
