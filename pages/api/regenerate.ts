// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse, NextRequest } from 'next/server';

// Database
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Our Imports
import { User } from '../../utils/types/user';
import makeid from '../../utils/makeid';

// Edge config
export const config = {
  runtime: 'edge',
};

export default async function PATCH(req: NextRequest) {
  const res = NextResponse.next();

  try {
    if (req.method != 'PATCH')
      return new Response(
        JSON.stringify({
          message: 'Invaid Method ! EXPECTED: PATCH method.',
          status: 405,
        }),
        {
          status: 405,
          headers: {
            'content-type': 'application/json',
          },
        }
      );

    const authorization = req.headers.get('authorization');
    
    const body = await req?.json();

    const supabase = createMiddlewareClient({ req, res });

    const { data: token }: { data: User } = await supabase
      .from('Users')
      .select()
      .eq('id', body.userId)
      .limit(1)
      .single();

    if (token) {
      if(token.apiKey != authorization) return new Response(
        JSON.stringify({
          message: 'Not authorized !',
          status: 401,
        }),
        {
          status: 401,
          headers: {
            'content-type': 'application/json',
          },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: 'User not found !',
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

    const key = makeid(20);

    const { error } = await supabase
      .from('Users')
      .update({ apiKey: key })
      .eq('id', token.id);

    if (error) {
      console.error(error);
      return new Response(
        JSON.stringify({
          message: 'Error while regenerating token ! Contact the owner',
          errorCode: "REGEN_FAIL",
          status: 500,
        }),
        {
          status: 500,
          headers: {
            'content-type': 'application/json',
          },
        }
      );
    } else
      return new Response(
        JSON.stringify({ regen: true, apiKey: key, status: 200 }),
        {
          status: 200,
          headers: {
            'content-type': 'application/json',
          },
        }
      );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        message: 'Bad Request !',
        status: 400,
      }),
      {
        status: 400,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }
}
