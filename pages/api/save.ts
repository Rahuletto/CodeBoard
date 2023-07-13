// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse, NextRequest } from 'next/server';

// Database
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Our Imports
import { User } from '../../utils/types/user';
import { BoardFile } from '../../utils/types/board';
import makeid from '../../utils/makeid';
import { extensions } from '../../utils/extensions';

// Ratelimits
import rateLimit from '../../utils/rate-limit';
import { LanguagesArray } from '../../utils/types/languages';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500
});

// Request Body
type SaveRequestBody = {
  name: string;
  description: string;
  files: BoardFile[];
};

// Edge config
export const config = {
  runtime: 'edge',
  api: {
    bodyParser: {
      sizeLimit: '50kb', // Set desired value here
    },
  },
};

export default async function handler(req: NextRequest) {
  const res = NextResponse.next();

  try {
    const body: SaveRequestBody = await req?.json();

    const { searchParams } = new URL(req.url);

    const authorization = req.headers.get('authorization');

    const apikey = authorization || searchParams.get('key');

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

    body.name = body.name || "Untitled";
    body.description = body.description || "No Description";

    if (body.name?.length > 20) {
      return new Response(
        JSON.stringify({
          message: 'Board name exceeded the limit of 20 characters',
          errorCode: 'LIMIT_EXCEED',
          status: 304,
        }),
        {
          status: 304,
          headers: {
            'content-type': 'application/json',
          },
        }
      );
    }
    if (body.description?.length > 128) {
      return new Response(
        JSON.stringify({
          message: 'Board description exceeded the limit of 128 characters',
          errorCode: 'LIMIT_EXCEED',
          status: 304,
        }),
        {
          status: 304,
          headers: {
            'content-type': 'application/json',
          },
        }
      );
    }

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
    else if (token) {
      try {
        await limiter.check(res, 21, apikey as string);
      } catch {
        return new Response(
          JSON.stringify({
            message: 'Rate limit exceeded. Only 20 saves per minute',
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

    let cont = '';
    let files: BoardFile[] = [];

    body.files.every((f) => {
      if (!f.name || !f.language || !f.value)
        return new Response(
          JSON.stringify({
            message: 'Malformed File !',
            file: f,
            status: 400,
          }),
          {
            status: 400,
            headers: {
              'content-type': 'application/json',
            },
          }
        );
      else if (f.name.length > 32)
        return new Response(
          JSON.stringify({
            message: 'File name exceeded the limit of 32 characters',
            file: f,
            status: 400,
          }),
          {
            status: 400,
            headers: {
              'content-type': 'application/json',
            },
          }
        );
      else {
        const lang = LanguagesArray.find((n) => f.language == n)

        if (!lang) {
          return new Response(
            JSON.stringify({
              message: 'Unknown file language !',
              languages: LanguagesArray,
              status: 400,
            }),
            {
              status: 400,
              headers: {
                'content-type': 'application/json',
              },
            }
          );
        } else {
          const ind = files.findIndex((a) => a.name == f.name);
          if (ind)
            return new Response(
              JSON.stringify({
                message: `File names are too similar. File index: ${ind}`,
                status: 400,
              }),
              {
                status: 400,
                headers: {
                  'content-type': 'application/json',
                },
              }
            );
          else {
            files.push(f);
            return true;
          }
        }
      }
    });

    if (files?.length > 2) {
      files = [files[0], files[1]];
      cont =
        ' - Reached file limit (2). Sent ' +
        files?.length +
        ' amount of files. Considering first two files';
    }

    const key = makeid(8);

    const { error } = await supabase.from('Boards').insert({
      name: body.name,
      description: body.description,
      encrypt: false,
      autoVanish: false,
      fork: null,
      files: files,
      key: key,
      author: 'bot',
      createdAt: Date.now(),
    });

    if (error) {
      console.error(error);
      return new Response(
        JSON.stringify({
          message: 'Error while uploading board to cloud ! Contact the owner',
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
      JSON.stringify({
        message: 'Successfully created a board' + cont,
        board: `/bin/${key}`,
        status: 201,
        created: true,
      }),
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
