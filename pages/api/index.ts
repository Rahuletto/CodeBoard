// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  runtime: 'edge',
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  return new Response(JSON.stringify({
    info: 'Welcome to CodeBoard API. You have 1 endpoint to use with CodeBoard',
    get: [{ endpoint: '/fetch', usage: '/fetch?id={key}' }],
  }), {
    status: 303,
    headers: {
      'content-type': 'application/json',
    }
  });

}
