// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import Code from '../../model/code';
import connectDB from '../../middleware/mongodb';
import { Board } from '../../utils/board';

export interface FetchResponse extends Omit<Board, 'options'> {
  status: number;
  encrypted: boolean;
  autoVanish: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.headers.authorization != process.env.NEXT_PUBLIC_KEY)
    return res.status(401).json({
      message: 'Not Authorized !',
      status: 401,
    });
    
  const allBoards = await Code.find({})

  const boards = [];

  allBoards.forEach(board => {
    if(board.options[0].autoVanish) return;
    else boards.push(board.key);
  })

  if (boards)
    return res.status(200).json({
      keys: boards
    });
  else return res.status(404).json({ keys: 'NOT FOUND', status: 404 });
}
