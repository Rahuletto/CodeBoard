export type Board = {
  name: string;
  description: string;
  files: BoardFile[];
  key: string; // Primary Key
  encrypt: boolean;
  autoVanish: boolean
  fork: { status: boolean, key: string, name: string } | undefined;
  createdAt: number;
  author: string;
  madeBy: string | null;
};

export type BoardFile = {
  name: string;
  language: string;
  value: string; // The Code
  terminal?: string; // New terminal
};