// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse, NextRequest } from 'next/server';

// Database
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Config
export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const res = NextResponse.next();

  const authorization = req.headers.get('authorization')

  if (authorization != process.env.NEXT_PUBLIC_KEY)
    return new Response(
      JSON.stringify({
        message: 'Not Authorized !',
        status: 401,
      }),
      {
        status: 401,
      }
    );

  const supabase = createMiddlewareClient({ req, res });

  const { data: boards } = await supabase.from('Boards').select();

  const keys = [];

  boards.forEach((board) => {
    if (board.autoVanish) return;
    else keys.push(board.key);
  });

  if (boards)
    return new Response(
      JSON.stringify({
        keys: keys,
        status: 200
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
          'cache-control': 'public, s-maxage=1200, stale-while-revalidate=600',
        },
      }
    );
  else
    return new Response(JSON.stringify({ message: 'NOT FOUND', status: 404 }), {
      status: 404,
    });
}
