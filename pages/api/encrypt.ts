// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse, NextRequest } from 'next/server';
import { AESEncrypt } from '../../utils/aes';
import { BoardFile } from '../../utils/types/board';

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
    try {
        console.log(req.headers)
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


        const body: { files: BoardFile[] } = await req?.json();
        const encrypted = []
        body.files.forEach(async (file) => {
            encrypted.push({
                name: file.name,
                language: file.language,
                value: AESEncrypt(file.value),
            });
        });

        return new Response(
            JSON.stringify({
                files: encrypted
            }),
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
