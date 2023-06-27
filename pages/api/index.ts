// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  return res.status(303).json({
    info: 'Welcome to CodeBoard API. You have 1 endpoint to use with CodeBoard',
    get: [
      { endpoint: '/fetch', usage: '/fetch?id={key}' },
      { endpoint: '/teapot', usage: '/teapot' },
    ],
  });
}
