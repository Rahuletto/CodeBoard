// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse, NextRequest } from 'next/server';

// Database
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Our Imports
import { User } from '../../utils/types/user';
import { Board, BoardFile } from '../../utils/types/board';
import { AESDecrypt } from '../../utils/aes';
import redis from '../../utils/redis';

// Types
export type FetchResponse = {
  name: string;
  description: string;
  files: BoardFile[];
  key: string;
  encrypt: boolean;
  autoVanish: boolean;
  fork: { status: boolean; key: string; name: string } | undefined;
  author: string;
  bot: boolean;
  createdAt: number;
  status: number; // HTTPS Status code
};

// Edge config
export const config = {
  runtime: 'edge',
};

export default async function GET(req: NextRequest) {
  const res = NextResponse.next();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  const authorization = req.headers.get('authorization');

  const apikey = authorization || searchParams.get('key');

  const supabase = createMiddlewareClient({ req, res });

  const { data: token }: { data: User[] } = await supabase
    .from('Users')
    .select()
    .eq('apiKey', apikey)
    .limit(1)
    .single();

  if (!token && authorization != process.env.NEXT_PUBLIC_KEY)
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


  let boardRaw: Board = await redis.get(`board-${id}`)

  if (!boardRaw) {
    const { data }: { data: Board } = await supabase
      .from('Boards')
      .select()
      .eq('key', id)
      .limit(1)
      .single();

    boardRaw = data
    if (data) await redis.set(`board-${id}`, data, { ex: 60 * 3 })
  }

  if (!boardRaw)
    return new Response(
      JSON.stringify({
        message: 'NOT FOUND. Try a valid board id',
        status: 404,
      }),
      {
        status: 404,
        headers: {
          'content-type': 'application/json',
          'cache-control': 'public, s-maxage=1200, stale-while-revalidate=600',
        },
      }
    );

  if (
    (Number(boardRaw.createdAt) + 86400 * 1000 < Date.now() &&
      boardRaw?.autoVanish) ||
    boardRaw?.files.length == 0
  ) {
    const { error: boardError } = await supabase
      .from('Boards')
      .delete()
      .eq('key', boardRaw.key);

      if(boardRaw) await redis.del(`board-${id}`)

    return new Response(
      JSON.stringify({
        message: 'NOT FOUND. Try a valid board id',
        status: 404,
      }),
      {
        status: 404,
        headers: {
          'content-type': 'application/json',
          'cache-control': 'public, s-maxage=1200, stale-while-revalidate=600',
        },
      }
    );
  }

  let board = {
    name: boardRaw.name,
    description: boardRaw.description,
    files: boardRaw.files,
    key: boardRaw.key,
    encrypt: boardRaw.encrypt,
    autoVanish: boardRaw.autoVanish,
    fork: boardRaw.fork,
    author: boardRaw?.author?.startsWith('bot') ? 'bot' : boardRaw.author,
    bot: boardRaw?.author?.startsWith('bot') ? true : false,
    madeBy: boardRaw.madeBy,
    createdAt: boardRaw.createdAt,
    status: 200,
  };

  if ((token || authorization == process.env.NEXT_PUBLIC_KEY) && boardRaw) {
    try {
      let decryptedFiles: BoardFile[] = [];

      if (boardRaw.encrypt) {
        boardRaw.files.forEach((f) => {
          decryptedFiles.push({
            name: f.name,
            language: f.language,
            value: AESDecrypt(f.value),
          });
        });
      } else decryptedFiles = boardRaw.files;

      board.files = decryptedFiles;
    } catch (err) {
      console.warn(err);
      return new Response(
        JSON.stringify({
          message:
            'Server Error while parsing encrypt files ! Contact the owner',
          errorCode: 'ENCRPT_ERR',
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

    return new Response(JSON.stringify(board), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, s-maxage=1200, stale-while-revalidate=600',
      },
    });
  }
}
