// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Code from '../../model/code'
import connectDB from '../../middleware/mongodb'
import {languages} from "../index"

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



export default async function handler(req, res) {
  // Get data submitted in request's body.
  const db = await connectDB()
  const body = req.body

    Code.create({
      name: req.body.name,
      description: req.body.description,
      options: req.body.options,
      files: req.body.files,
      key: req.body.key,
      createdAt: req.body.createdAt
    })


  
  res.status(200).json({ bin: `/bin/${req.body.key}`, state: true })
}