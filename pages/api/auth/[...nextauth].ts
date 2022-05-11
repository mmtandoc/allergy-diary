import axios from "axios"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john.doe@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        let user = null

        await axios
          .post(
            "http://localhost:3000/api/session",
            JSON.stringify(credentials),
            {
              headers: { "Content-Type": "application/json" },
            },
          )
          .then(
            (res) => {
              user = res?.data
            },
            (error) => {
              console.log(error)
            },
          )

        //const user = res?.data

        // If no error and we have user data, return it
        if (user) {
          return user
        }
        // Return null if user data could not be retrieved
        return null
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
        token.user = user
      }

      return token
    },
    session: async ({ session, token, user }) => {
      if (token) {
        session.id = token.id
        session.user = token.user
      }
      return session
    },
  },
})
