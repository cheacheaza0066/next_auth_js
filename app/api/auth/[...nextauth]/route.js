import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from 'bcryptjs'
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
const authOptions = {
    providers: [
        CredentialsProvider({
          name: 'credentials',
          credentials: {},
          async authorize(credentials) {
           
            const { email, password } = credentials;

            try {

                await connectMongoDB();
                const user = await User.findOne({ email });

                if (!user) {
                    return null;
                }

                const passwordMatch = await bcrypt.compare(password, user.password);

                if (!passwordMatch) {
                    return null;
                }

                console.log(user);
                return user;

            } catch(error) {
                console.log("Error: ", error)
            }

          }
        }),
        GitHubProvider({
            profile(profile) {
              console.log("Profile GitHub: ", profile);
      
              let userRole = "GitHub User";
              if (profile?.email == "jake@claritycoders.com") {
                userRole = "admin";
              }
      
              return {
                ...profile,
                role: userRole,
              };
            },
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_Secret,
          }),
          GoogleProvider({
            profile(profile) {
              console.log("Profile Google: ", profile);
      
              let userRole = "Google User";
              return {
                ...profile,
                id: profile.sub,
                role: userRole,
              };
            },
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_Secret,
          })


    ],
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, user, account, profile, isNewUser }) {

            if (user) {
                return {
                    ...token,
                    id: user._id,
                    role: user.role
                }
            }

            return token
        },
        async session({ session, user, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    role: token.role
                }
            }
        }
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }