// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import Code from '../../model/code';
import connectDB from '../../middleware/mongodb';

type CreateRequestBody = {
  name: string,
  description: string,
  options: any,
  files: any[],
  key: string,
  createdAt: number,
};

export const config = {
	runtime: 'edge',
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get data submitted in request's body.
  const db = await connectDB();
  const body: CreateRequestBody = req.body;
  if (req.method != 'POST')
  return new Response(
    JSON.stringify({
      message: 'Invaid Method ! EXPECTED: POST method.',
    }),
    {
      status: 405,
      headers: {
        'content-type': 'application/json',
      },
    }
  )

  if (req.headers.authorization != process.env.NEXT_PUBLIC_KEY)
    return new Response(
      JSON.stringify({
        message: 'Not Authorized !',
        status: 401
      }),
      {
        status: 401,
        headers: {
          'content-type': 'application/json',
        },
      }
    )

  Code.create({
    name: req.body.name,
    description: req.body.description,
    options: req.body.options,
    files: req.body.files,
    key: req.body.key,
    createdAt: req.body.createdAt,
  });

  return new Response(
    JSON.stringify({ board: `/bin/${req.body.key}`, status: 201, workDone: true }),
    {
      status: 201,
      headers: {
        'content-type': 'application/json',
      },
    }
  )
  
}
