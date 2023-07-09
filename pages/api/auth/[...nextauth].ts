import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

import User from '../../../model/user';
import PBKDF2 from '../../../utils/encrypt';
import makeid from '../../../utils/makeid';

export default NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      checks: ['none'],
      
    }),
  ],
  // pages: {
  //   signIn: '/auth/signin',
  //   signOut: '/',
  //   error: '/auth/error',
  // },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token, user }) {
      // @ts-ignore
      session.accessToken = token.accessToken;

      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async signIn({ user, account, profile, email, credentials }) {
      const ifExist = await User.findOne({ id: user.id });
      if (ifExist) return true;
      else {
        User.create({
          id: user.id,
          name: user.name,
          image: user.image,
          email: PBKDF2(user.email),
          boards: [],
          apiKey: makeid(20),
        });

        return true;
      }
    },
  },
});
