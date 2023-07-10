// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

// Model and Mongoose
import connectDB from '../../middleware/mongodb';
import Code from '../../model/code';
import User from '../../model/user';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  const queries = req.query;

  if (req.method != 'DELETE')
    return res.status(405).json({
      message: 'Invaid Method ! EXPECTED: DELETE method.',
      status: 405
    });

  if (req.headers.authorization != process.env.NEXT_PUBLIC_KEY)
    return res.status(401).json({
      message: 'Not Authorized !',
      status: 401,
    });

  if (!queries.id)
    return res.status(422).json({
      message: 'Board ID not provided !',
      status: 422,
    });

  await Code.findOneAndDelete({ key: queries.id }).exec();
  const user = await User.findOne({ id: queries.userId });
  const removed = user.boards.filter(function (item) {
    return item.key !== queries.id;
  });

  await User.findOneAndUpdate(
    { id: queries.userId },
    { boards: [...removed] }
  ).exec();

  return res.status(200).json({ deleted: true });
}
