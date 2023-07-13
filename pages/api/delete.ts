// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse, NextRequest } from 'next/server';

// Database
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Our Imports
import { User } from '../../utils/types/user';

// Ratelimits
import rateLimit from '../../utils/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500
});

// Edge config
export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const res = NextResponse.next();

  try {
    if (req.method != 'DELETE')
      return new Response(
        JSON.stringify({
          message: 'Invaid Method ! EXPECTED: DELETE method.',
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
    if (authorization != process.env.NEXT_PUBLIC_KEY)
      return new Response(
        JSON.stringify({
          message: 'Not Authorized !',
          status: 401,
        }),
        {
          status: 401,
          headers: {
            'content-type': 'application/json',
          },
        }
      );

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id)
      return new Response(
        JSON.stringify({
          message: 'Board ID not provided !',
          status: 422,
        }),
        {
          status: 422,
          headers: {
            'content-type': 'application/json',
          },
        }
      );

    const supabase = createMiddlewareClient({ req, res });

    const { data: user }: { data: User } = await supabase
      .from('Users')
      .select()
      .eq('id', userId)
      .limit(1)
      .single();

    if (user) {
      try {
        await limiter.check(res, 11, user.apiKey as string);
      } catch {
        return new Response(
          JSON.stringify({
            message: 'Rate limit exceeded. Only 10 deletions per minute',
            apiKey: 'XXXXXXXXXXXX' + user.apiKey.slice(12),
            status: 429,
          }),
          {
            status: 429,
            headers: {
              'content-type': 'application/json',
            },
          }
        );
      }
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

    const { error: boardError } = await supabase
      .from('Boards')
      .delete()
      .eq('key', id);

    const removed = user.boards.filter(function (item) {
      return item.key !== id;
    });

    const { error: userError } = await supabase
      .from('Users')
      .update({ boards: [...removed] })
      .eq('id', userId);

    if (boardError) {
      console.warn('Board_ERR: ' + boardError);
      return new Response(
        JSON.stringify({
          message: 'Error while deleting ! Contact the owner',
          errorCode: "DEL_BOARD_FAIL",
          status: 500,
        }),
        {
          status: 500,
          headers: {
            'content-type': 'application/json',
          },
        }
      );
    } else if (userError) {
      console.warn('User_ERR: ' + userError);
      return new Response(
        JSON.stringify({
          message: 'Error while updating users board ! Contact the owner',
          errorCode: "UPDATE_USER_FAIL",
          status: 500,
        }),
        {
          status: 500,
          headers: {
            'content-type': 'application/json',
          },
        }
      );
    }
    else
      return new Response(JSON.stringify({ deleted: true, status: 200 }), {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      });
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
