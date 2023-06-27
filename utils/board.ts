export type Board = {
  name: string;
  description: string;
  files: BoardFile[];
  options: Options;
  key: string;
  createdAt: number;
};

export type BoardFile = {
  name: string;
  language: string;
  value: string; // The Code
};

export type Options = {
  autoVanish: boolean;
  encrypt: boolean;
};