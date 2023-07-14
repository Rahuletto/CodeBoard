// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse, NextRequest } from 'next/server';

// Database
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Our Imports
import { BoardFile } from '../../utils/types/board';

// Types
type CreateRequestBody = {
  name: string;
  description: string;
  files: BoardFile[];
  key: string;
  encrypt: boolean;
  autoVanish: boolean;
  fork: { status: boolean; key: string; name: string } | undefined;
  createdAt: number;
  author: string | null;
};

// Edge config
export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const res = NextResponse.next();

  try {
    const authorization = req.headers.get('authorization');

    if (req.method != 'POST')
      return new Response(
        JSON.stringify({
          message: 'Invaid Method ! EXPECTED: POST method.',
          status: 405,
        }),
        {
          status: 405,
          headers: {
            'content-type': 'application/json',
          },
        }
      );

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

    const supabase = createMiddlewareClient({ req, res });
    const body: CreateRequestBody = await req?.json();

    const { data: board } = await supabase
      .from('Boards')
      .select()
      .eq('key', body.key)
      .limit(1)
      .single();
    if (board) {
      console.log('BRO DONT SPAM');
      return new Response(
        JSON.stringify({
          board: `/bin/${body.key}`,
          message: 'Board with this key already exists. ',
          status: 200,
        }),
        {
          status: 200,
          headers: {
            'content-type': 'application/json',
          },
        }
      );
    }

    if (body.author) {
      const { data: user } = await supabase
        .from('Users')
        .select()
        .eq('id', body.author)
        .limit(1)
        .single();

      if(!user) body.author = null;
    }

    const { error } = await supabase.from('Boards').insert({
      name: body.name,
      description: body.description,
      encrypt: body.encrypt,
      autoVanish: body.autoVanish,
      fork: body.fork,
      files: body.files,
      key: body.key,
      author: body.author,
      createdAt: body.createdAt ?? Date.now(),
    });

    if (error) {
      console.error(error);
      return new Response(
        JSON.stringify({
          message: 'Error while creating board ! Contact the owner',
          errorCode: 'INSERT_FAIL',
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
    return new Response(
      JSON.stringify({ board: `/bin/${body.key}`, created: true, status: 201 }),
      {
        status: 201,
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
