export type User = {
  id: string;
  email: string; // Encrypted
  name: string;
  image: string; // Profile pic
  boards: UserBoards[];
  apiKey: string;
};

export type UserBoards = {
  key: string;
  title: string;
  desc: string;
};
