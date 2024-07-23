import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            // authorize
            async authorize(credentials: any): Promise<any> {
                // credentials is used to extract any identifier (email, password etc.)
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        // we'll find user either by username or email
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier},
                        ]
                    })

                    if(!user) {
                        throw new Error('No user found with this email')
                    }
                    
                    if(!user.isVerified) {
                        throw new Error('Please verify your email before you try to login')
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(isPasswordCorrect) {
                        return user;
                        // after return again we give full control to authOptions
                    } else {
                        throw new Error('Incorrect Password');
                    }


                } catch (err: any) {
                    throw new Error(err);
                }
            }
        }),
    ],
    callbacks: {
        // This user we created under credentialsprovider
        // Here we add more fields and values into token itself
        async jwt({ token, user}) {
            if(user) {
                token._id = user._id?.toString();
                token.isVerfied = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token
        },

        async session({ session, token }) {
            if (token) {
              session.user._id = token._id;
              session.user.isVerified = token.isVerified;
              session.user.isAcceptingMessages = token.isAcceptingMessages;
              session.user.username = token.username;
            }
            return session
          },
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}