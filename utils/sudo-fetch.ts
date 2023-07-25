import { SupabaseClient } from '@supabase/supabase-js';
import { Board, BoardFile } from './types/board';
import { AESDecrypt } from './aes';
import { FetchResponse } from '../pages/api/fetch';
import { Redis } from '@upstash/redis/nodejs';

export function sudoFetch(
  supabase: SupabaseClient,
  id: string,
  client: boolean = false
): Promise<false | FetchResponse> {
  return new Promise(async (resolve) => {

    let redis: Redis;

    if (!client && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_TOKEN) redis = (await import('./redis')).default

    let board: Board = redis ? await redis.get(`board-${id}`) : null

    if (!board) {
      const { data }: { data: Board } = await supabase
        .from('Boards')
        .select()
        .eq('key', id)
        .limit(1)
        .single();

      board = data
      if (data && redis) await redis.set(`board-${id}`, data, { ex: 60 * 3 })
    }

    if (!board) resolve(false);
    else {
      if (
        (Number(board.createdAt) + 86400 * 1000 < Date.now() &&
          board?.autoVanish) ||
        board?.files.length == 0
      ) {
        const { error } = await supabase
          .from('Boards')
          .delete()
          .eq('key', board.key);
          
        if (error) console.warn(error);

        resolve(false);
      } else {
        let decryptedFiles: BoardFile[] = [];

        let resBoard = {
          name: board.name,
          description: board.description,
          files: board.files,
          key: board.key,
          encrypt: board.encrypt,
          autoVanish: board.autoVanish,
          fork: board.fork,
          author: board?.author?.startsWith('bot') ? 'bot' : board.author,
          bot: board?.author?.startsWith('bot') ? true : false,
          madeBy: board.madeBy,
          createdAt: board.createdAt,
          status: 200,
        };

        if (board.encrypt) {
          board.files.forEach((f) => {
            decryptedFiles.push({
              name: f.name,
              language: f.language,
              value: AESDecrypt(f.value),
              terminal: f.terminal ? AESDecrypt(f?.terminal) : null
            });
          });
        } else decryptedFiles = board.files;

        resBoard.files = decryptedFiles;
        resolve(resBoard);
      }
    }
  });
}
