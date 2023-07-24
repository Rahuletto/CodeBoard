// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';

// Database
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Our Imports
import { User } from '../../utils/types/user';

// Edge config
export const config = {
  runtime: 'edge',
};

export default async function GET(req: NextRequest) {
  const res = NextResponse.next();

  const { searchParams } = new URL(req.url);

  const authorization = req.headers.get('authorization');
  const apikey = authorization || searchParams.get('key');

  const supabase = createMiddlewareClient({ req, res });

  const { data: token }: { data: User } = await supabase
    .from('Users')
    .select()
    .eq('apiKey', apikey)
    .limit(1)
    .single();

  if (token)
    return new Response(
      JSON.stringify({
        message: 'VALID. This api key is valid',
        valid: true,
        status: 200,
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  else
    return new Response(
      JSON.stringify({
        message: 'NOT_VALID. This api key is invalid',
        valid: false,
        status: 404,
      }),
      {
        status: 404,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
}
