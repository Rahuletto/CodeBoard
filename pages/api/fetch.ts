// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import Code from '../../model/code';
import connectDB from '../../middleware/mongodb';
import { Board } from '../../utils/board';

export interface FetchResponse extends Omit<Board, 'options'> {
  status: number;
  encrypted: boolean;
}

export const config = {
  runtime: 'edge',
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await connectDB();
  let queries = req.query;

  const boardRaw = await Code.findOne({ key: queries.id });

  if (boardRaw)
    return new Response(
      JSON.stringify({
        createdAt: boardRaw.createdAt,
        description: boardRaw.description,
        files: boardRaw.files,
        key: boardRaw.key,
        name: boardRaw.name,
        encrypted: boardRaw.options[0].encrypt,
        status: 200,
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      }
    )

  else return new Response({ board: 'NOT FOUND', status: 404 }, {
    status: 404,
    headers: {
      'content-type': 'application/json',
    }
  });
}
