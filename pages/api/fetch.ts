// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Code from '../../model/code'
import connectDB from '../../middleware/mongodb'

export default async function handler(req: NextApiRequest , res: NextApiResponse) {
    const db = await connectDB()
    let queries = req.query
  
    const board = await Code.findOne({ key: queries.id });

    if (board) return res.status(200).json({ board: board, status: 200 });
    else return res.status(404).json({ board: "NOT FOUND", status: 404 })
}
