// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse, NextRequest } from 'next/server';

// Database
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Our Imports
import { User } from '../../utils/types/user';
import { Board, BoardFile } from '../../utils/types/board';
import { AESDecrypt } from '../../utils/aes';

// Ratelimits
import rateLimit from '../../utils/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500
});

// Types
export type FetchResponse = {
  name: string,
  description: string,
  files: BoardFile[],
  key: string,
  encrypt: boolean,
  autoVanish: boolean,
  fork: { status: boolean, key: string, name: string } | undefined,
  author: string,
  bot: boolean,
  createdAt: number,
  status: number, // HTTPS Status code
}

// Edge config
export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
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

  if (token) {
    try {
      await limiter.check(res, 41, apikey as string);
    } catch {
      return new Response(
        JSON.stringify({
          message: 'Rate limit exceeded. Only 40 fetches per minute',
          apiKey: 'XXXXXXXXXXXX' + apikey.slice(12),
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
  }

  const { data: boardRaw }: { data: Board } = await supabase
    .from('Boards')
    .select()
    .eq('key', id)
    .limit(1)
    .single();

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

    if((Number(boardRaw.createdAt) + 86400 * 1000 < Date.now() &&
    boardRaw?.autoVanish) ||
    boardRaw?.files.length == 0){
      const { error: boardError } = await supabase
      .from('Boards')
      .delete()
      .eq('key', boardRaw.key);
    }

  let board = {
    name: boardRaw.name,
    description: boardRaw.description,
    files: boardRaw.files,
    key: boardRaw.key,
    encrypt: boardRaw.encrypt,
    autoVanish: boardRaw.autoVanish,
    fork: boardRaw.fork,
    author: boardRaw.author,
    bot: boardRaw.author.startsWith('bot') ? true : false,
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
            errorCode: "ENCRPT_ERR",
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
  } else
    return new Response(JSON.stringify(board), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, s-maxage=1200, stale-while-revalidate=600',
      },
    });
}
