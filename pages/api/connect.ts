// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import Code from '../../model/code';
import connectDB from '../../middleware/mongodb';

let interval: NodeJS.Timer;

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  // Get data submitted in request's body.
  const db = await connectDB();

  if (!interval) {
    interval = setInterval(async () => {
      const data = await Code.find({});

      data.forEach(async (obj) => {
        if (!obj) return;
        if (
          Number(obj.createdAt) + 86400 * 1000 < Date.now() &&
          obj?.options[0]?.autoVanish
        ) {
          await Code.findByIdAndRemove(obj._id);
        }
      });
    }, 10000);
  }

  return new Response(
    JSON.stringify({ started: db }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  )

}

// noinspection JSUnusedGlobalSymbols
export const config = { runtime: 'edge' };