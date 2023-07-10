// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

// Models and mongoose
import connectDB from '../../middleware/mongodb';
import Code from '../../model/code';
import User from '../../model/user';

// Our imports
import { AESDecrypt } from '../../utils/aes';
import { Board, BoardFile } from '../../utils/board';

// Rate limiting
import rateLimit from '../../utils/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500
});

export interface FetchResponse extends Omit<Board, 'options'> {
  status: number;
  encrypted: boolean;
  autoVanish: boolean;
  fork?: { status: boolean; key: string; name: string };
  bot: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  const queries = req.query;
  const apik = req.headers.authorization || queries.key;

  if (!queries.id)
    return res.status(422).json({
      message: 'Board ID not provided !',
      status: 422,
    });
  else if (queries.id == '{id}')
    queries.id = queries.id.replace('{id}', 'cEFTT17h');

  const token = await User.findOne({ apiKey: apik });

  if (token) {
    try {
      await limiter.check(res, 41, apik as string);
    } catch {
      return res.status(429).json({
        message: 'Rate limit exceeded. Only 40 fetches per minute',
        apiKey: 'XXXXXXXXXXXX' + apik.slice(12),
        status: 429,
      });
    }
  }

  const boardRaw: Board = await Code.findOne({ key: queries.id });

  if (!boardRaw)
    return res
      .status(404)
      .json({ message: 'NOT FOUND. Try a valid board id', status: 404 });

      res.setHeader(
        'Cache-Control',
        's-maxage=60, stale-while-revalidate=70'
      )

  let board = {
    name: boardRaw.name,
    description: boardRaw.description,
    files: boardRaw.files,
    key: boardRaw.key,
    createdAt: boardRaw.createdAt,
    encrypted: boardRaw.options[0].encrypt,
    autoVanish: boardRaw.options[0].autoVanish,
    fork: boardRaw.options[0].fork,
    author: boardRaw.author,
    bot: (boardRaw.author == 'bot' ? true : false),
    status: 200,
  };

  if (
    (token || req.headers.authorization == process.env.NEXT_PUBLIC_KEY) &&
    boardRaw
  ) {
    try {
      let decryptedFiles: BoardFile[] = [];

      if (boardRaw.options[0].encrypt) {
        boardRaw.files.forEach((f) => {
          decryptedFiles.push({
            name: f.name,
            language: f.language,
            value: AESDecrypt(f.value),
          });
        });
      } else decryptedFiles = boardRaw.files;

      board = {
        name: boardRaw.name,
        description: boardRaw.description,
        files: decryptedFiles,
        key: boardRaw.key,
        createdAt: boardRaw.createdAt,
        encrypted: boardRaw.options[0].encrypt,
        autoVanish: boardRaw.options[0].autoVanish,
        fork: boardRaw.options[0].fork,
        author: boardRaw.author,
        bot: (boardRaw.author == 'bot' ? true : false),
        status: 200,
      };
    } catch (err) {
      console.log(err);
    }
  }
  return res.status(200).json(board);
}
