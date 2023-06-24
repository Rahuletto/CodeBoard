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


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get data submitted in request's body.
  const db = await connectDB();
  const body: CreateRequestBody = req.body;
  if (req.method != 'POST')
    return res.status(405).json({
      message: 'Invaid Method ! EXPECTED: POST method.',
    })

  if (req.headers.authorization != process.env.NEXT_PUBLIC_KEY)
    return res.status(401).json({
      message: 'Not Authorized !',
      status: 401
    })

  Code.create({
    name: req.body.name,
    description: req.body.description,
    options: req.body.options,
    files: req.body.files,
    key: req.body.key,
    createdAt: req.body.createdAt,
  });

  if (req.headers.authorization != process.env.NEXT_PUBLIC_KEY)
    return res.status(201).json({ board: `/bin/${req.body.key}`, status: 201, workDone: true })

}
