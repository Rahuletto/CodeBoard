// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

// Models and mongoose
import connectDB from '../../middleware/mongodb';
import User from '../../model/user';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  const apik = req.headers.authorization || req.query.key;

  const token = await User.findOne({ apiKey: apik });

  if (!token) return res
  .status(404)
  .json({ message: 'NOT FOUND. Try a valid api key', valid: false, status: 404 });
  else return res.status(200).json({ message: "VALID. This api key is valid", valid: true, status: 200 })
}
