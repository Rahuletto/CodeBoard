// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  runtime: 'edge',
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  return new Response({
    message: "Im a teapot",
  }, {
    status: 418,
    headers: {
      'content-type': 'application/json',
    }
  });

}
