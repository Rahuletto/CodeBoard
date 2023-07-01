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
  const db = await connectDB();
  let queries = req.query;

  if (!queries.id) return res.status(422).json({
    message: 'Board ID not provided !',
    status: 422,
  });
  else if(queries.id == '{id}') queries.id = queries.id.replace('{id}', 'cEFTT17h')

  const boardRaw = await Code.findOne({ key: queries.id });

  if (boardRaw)
    return res.status(200).json({
      createdAt: boardRaw.createdAt,
      description: boardRaw.description,
      files: boardRaw.files,
      key: boardRaw.key,
      name: boardRaw.name,
      encrypted: boardRaw.options[0].encrypt,
      autoVanish: boardRaw.options[0].autoVanish,
      status: 200,
    });
  else return res.status(404).json({ board: 'NOT FOUND. Try a valid board id', status: 404 });
}
