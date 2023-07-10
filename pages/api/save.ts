// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

// Models and mongoose
import connectDB from '../../middleware/mongodb';
import Code from '../../model/code';
import User from '../../model/user';

// Our imports
import makeid from '../../utils/makeid';
import { BoardFile } from '../../utils/board';

// Ratelimiting
import rateLimit from '../../utils/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500
});

type CreateRequestBody = {
  name: string;
  description: string;
  files: BoardFile[];
  createdAt: number;
};

// Same as /api/create but save is for public api (not used by website servers)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get data submitted in request's body.
  await connectDB();
  const body: CreateRequestBody = req.body;
  const apik = req.headers.authorization || req.query.key;

  if (req.method != 'POST')
    return res.status(405).json({
      message: 'Invaid Method ! EXPECTED: POST method.',
      status: 405,
    });

  const token = await User.findOne({ apiKey: apik });

  if (!token)
    return res.status(401).json({
      message: 'Not Authorized !',
      status: 401,
    });

  try {
    await limiter.check(res, 21, apik as string);
  } catch {
    return res.status(429).json({
      message: 'Rate limit exceeded. Only 20 saves per minute',
      apiKey: 'XXXXXXXXXXXX' + apik.slice(12),
      status: 429,
    });
  }

  let cont = '';
  let files = body.files;

  if (files.length > 2) {
    files = [body.files[0], body.files[1]];
    cont =
      ' - Reached file limit (2). Sent ' +
      files.length +
      ' amount of files. Considering first two files';
  }

  const key = makeid(8);

  const ifExist = await Code.findOne({ key: key });
  if (ifExist) {
    console.log('BRO DONT SPAM');
    return res.status(200).json({
      board: `/bin/${key}`,
      message: 'Board with this key already exists. ',
      status: 200,
    });
  }

  Code.create({
    name: body.name,
    description: body.description,
    options: [{ encrypt: false, autoVanish: false }], // will not encrypt public api files
    files: files,
    key: key,
    createdAt: Date.now(),
    author: 'bot',
  });

  return res.status(201).json({
    message: 'Successfully created a board' + cont,
    board: `/bin/${key}`,
    status: 201,
    created: true,
  });
}
