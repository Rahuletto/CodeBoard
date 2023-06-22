// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Code from '../../model/code'
import connectDB from '../../middleware/mongodb'

type Data = {
  name: string,
  description: string,
  options: any,
  files: any[],
  key: string,
  createdAt: number
}

type res = {
  bin: string;
  state: boolean;
  data: any;
}



export default async function handler(req: NextApiRequest , res: NextApiResponse) {
  // Get data submitted in request's body.
  const db = await connectDB()
  const body = req.body
  if(req.method != "POST") return res.status(405).json({ message: "Invaid Method ! EXPECTED: POST method." })
  if(req.headers.authorization != process.env['KEY']) return res.status(400).json({ message: "Not Authorized !", status: 400 })

    Code.create({
      name: req.body.name,
      description: req.body.description,
      options: req.body.options,
      files: req.body.files,
      key: req.body.key,
      createdAt: req.body.createdAt
    })


  
  res.status(201).json({ bin: `/bin/${req.body.key}`, status: 201, workDone: true })
}