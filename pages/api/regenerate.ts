// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

// Models and Mongoose
import connectDB from '../../middleware/mongodb';
import User from '../../model/user';

// Our imports
import makeid from '../../utils/makeid';

// Ratelimiting
import rateLimit from '../../utils/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  const body = req.body;

  if (req.headers.authorization != process.env.NEXT_PUBLIC_KEY)
    return res.status(401).json({
      message: 'Not Authorized !',
      status: 401,
    });

  const user = await User.findOne({ email: body.email });

  try {
    await limiter.check(res, 2, user.apiKey as string);
  } catch {
    return res.status(429).json({
      error: 'Rate limit exceeded. Only 1 regenerate per minute',
      apiKey: 'XXXXXXXXXXXX' + (user.apiKey as string).slice(12),
      status: 429,
    });
  }

  const key = makeid(20);

  await User.findOneAndUpdate({ email: body.email }, { apiKey: key });

  return res
    .status(200)
    .json({ regen: true, apiKey: key });
}
