// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';

// Database
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Our Imports
import makeid from '../../utils/makeid';
import redis from '../../utils/redis';
import { BoardFile } from '../../utils/types/board';
import { LanguagesArray } from '../../utils/types/languages';
import { User } from '../../utils/types/user';

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
      sizeLimit: '32kb', // Set desired value here
    },
  },
};

export default async function POST(req: NextRequest) {
  const res = NextResponse.next();
  try {
    const { searchParams } = new URL(req.url);

    const authorization = req.headers.get('authorization');

    const apikey = authorization || searchParams.get('key');

    if (!authorization.startsWith('codeboard_api.'))
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

    const supabase = createMiddlewareClient({ req, res });

    const { data: token }: { data: User } = await supabase
      .from('Users')
      .select()
      .eq('apiKey', apikey)
      .limit(1)
      .single();

    if (!token)
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
      const body: SaveRequestBody = await req?.json();
      if (body.name?.length > 20) {
        return new Response(
          JSON.stringify({
            message: 'Board name exceeded the limit of 20 characters',
            errorCode: 'LIMIT_EXCEED',
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
      if (body.description?.length > 128) {
        return new Response(
          JSON.stringify({
            message: 'Board description exceeded the limit of 128 characters',
            errorCode: 'LIMIT_EXCEED',
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

      let cont = '';
      let files: BoardFile[] = [];

      try {
        if (!body.files[0])
          throw new Error(
            JSON.stringify({
              message: 'Malformed Files Array !',
              files: body.files,
              status: 400,
            })
          );

        body.files.forEach((f) => {
          if (!f.name || !f.language || !f.value)
            throw new Error(
              JSON.stringify({
                message: 'Malformed File !',
                file: f,
                status: 400,
              })
            );
          else if (f.name.length > 18)
            throw new Error(
              JSON.stringify({
                message: 'File name exceeded the limit of 18 characters',
                file: f,
                status: 400,
              })
            );
          else {
            const copyFile = files.find((a) => a.name == f.name);
            if (copyFile)
              throw new Error(
                JSON.stringify({
                  message: `File names are too similar.`,
                  status: 400,
                })
              );

            const lang = LanguagesArray.find((n) => f.language == n);
            if (lang) {
              files.push(f);
            } else if (!lang)
              throw new Error(
                JSON.stringify({
                  message: 'Unknown file language !',
                  languages: LanguagesArray,
                  status: 400,
                })
              );
          }
        });
      } catch (err: any) {
        return new Response(err, {
          status: 400,
          headers: {
            'content-type': 'application/json',
          },
        });
      }

      if (files?.length > 2) {
        files = [files[0], files[1]];
        cont =
          ' - Reached file limit (2). Sent ' +
          files?.length +
          ' amount of files. Considering first two files';
      }

      const key = makeid(8);
      const data = {
        name: body.name || 'Untitled',
        description: body.description || 'No Description',
        encrypt: false,
        autoVanish: false,
        fork: null,
        files: files,
        key: key,
        author: `bot | ${token.id}`,
        createdAt: Date.now(),
        madeBy: token.id,
      };

      const { error } = await supabase.from('Boards').insert(data);

      await redis.set(`board-${key}`, data, { ex: 60 * 3 });

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
    }
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        message: 'Bad Request !',
        error: err,
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
