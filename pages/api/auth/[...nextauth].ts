import NextAuth from "next-auth"
import GithubProvider from 'next-auth/providers/github'

import User from '../../../model/user';
import PBKDF2 from '../../../utils/encrypt'
import makeid from "../../../utils/makeid";

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth/signin',
        signOut: '/',
        error: '/auth/error',
    },
    callbacks: {
        async signIn({ user }) {
            console.log(user)
            const ifExist = await User.findOne({ email: PBKDF2(user.email) }).exec();
            if (ifExist) return true;

            User.create({
                name: user.name,
                image: user.image,
                email: PBKDF2(user.email),
                boards: [],
                apiKey: makeid(20)
            });

            return true
        }
    }
})