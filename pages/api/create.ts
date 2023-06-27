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

  const ifExist = await Code.findOne({ key: body.key }).exec()
  if (ifExist) {
    console.log('BRO DONT SPAM')
    return res.status(200).json({
      board: `/bin/${req.body.key}`,
      message: "Board with this key already exists. ",
      error: 200
    })
  }


  Code.create({
    name: body.name,
    description: body.description,
    options: body.options,
    files: body.files,
    key: body.key,
    createdAt: body.createdAt,
  });

  return res.status(201).json({ board: `/bin/${req.body.key}`, status: 201, workDone: true })

}
