// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Code from '../../model/code'
import connectDB from '../../middleware/mongodb'
import {languages} from "../index"

let interval;

export default async function handler(req, res) {
  // Get data submitted in request's body.
  const db = await connectDB()
  
  if(!interval) {
  interval = setInterval(async () => {
    const data = await Code.find({})
    
    data.forEach(async (obj) => {
      if(((obj.createdAt + (86400 * 1000)) < Date.now()) && obj.options[0].autoVanish) {
        await Code.findByIdAndRemove(obj._id)
      }
    })
    
  }, 10000)
  }

  res.status(200).send({ started: true })
}
