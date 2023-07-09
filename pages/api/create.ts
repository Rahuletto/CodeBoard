// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

// Models and mongoose
import Code from '../../model/code';
import connectDB from '../../middleware/mongodb';
import User from '../../model/user';
import { BoardFile, Options } from '../../utils/board';

type CreateRequestBody = {
  name: string;
  description: string;
  options: Options[];
  files: BoardFile[];
  key: string;
  createdAt: number;
  author: string | null;
};

// Same as /api/save but create is sudo (Only for the website servers)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get data submitted in request's body.
  await connectDB();
  const body: CreateRequestBody = req.body;

  if (req.method != 'POST')
    return res.status(405).json({
      message: 'Invaid Method ! EXPECTED: POST method.',
      status: 405,
    });

  if (req.headers.authorization != process.env.NEXT_PUBLIC_KEY)
    return res.status(401).json({
      message: 'Not Authorized !',
      status: 401,
    });

  const ifExist = await Code.findOne({ key: body.key });
  if (ifExist) {
    console.log('BRO DONT SPAM');
    return res.status(200).json({
      board: `/bin/${req.body.key}`,
      message: 'Board with this key already exists. ',
      status: 200,
    });
  }

  if (body.author) {
    const user = await User.findOne({ email: body.author });
    const newBoard = {
      title: body.name,
      desc: body.description,
      key: body.key,
    };

    if (user)
      await User.findOneAndUpdate(
        { email: body.author },
        { boards: [...user.boards, newBoard] }
      );
    else body.author = null;
  }

  Code.create({
    name: body.name,
    description: body.description,
    options: body.options,
    files: body.files,
    key: body.key,
    createdAt: body.createdAt,
    author: body.author,
  });

  return res
    .status(201)
    .json({ board: `/bin/${req.body.key}`, status: 201, workDone: true });
}
