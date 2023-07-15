import { SupabaseClient } from '@supabase/supabase-js';
import { Board, BoardFile } from './types/board';
import { AESDecrypt } from './aes';
import { FetchResponse } from '../pages/api/fetch';

export function sudoFetch(
  supabase: SupabaseClient,
  id: string
): Promise<false | FetchResponse> {
  return new Promise(async (resolve) => {
    const { data: board }: { data: Board } = await supabase
      .from('Boards')
      .select()
      .eq('key', id)
      .limit(1)
      .single();

    if (!board) resolve(false);
    else {
      if (
        (Number(board.createdAt) + 86400 * 1000 < Date.now() &&
          board?.autoVanish) ||
        board?.files.length == 0
      ) {
        const { error: boardError } = await supabase
          .from('Boards')
          .delete()
          .eq('key', board.key);

        if (boardError) console.warn(boardError);

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
            });
          });
        } else decryptedFiles = board.files;

        resBoard.files = decryptedFiles;
        resolve(resBoard);
      }
    }
  });
}