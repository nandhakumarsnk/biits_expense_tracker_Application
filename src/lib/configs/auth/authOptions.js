// lib/configs/auth/authOptions.js
import CredentialsProvider from "next-auth/providers/credentials";

console.log("aaaaaaa");
const authOptions = {
  secret: "boa$&a3cyq7eoda5hnip*hutg8rrmhg$j!ad61+88%s0bv-@*)",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        try {
          // const apiUrl = "http://localhost:3000/api/emp_login/";
          let apiUrl = `${process.env.NEXT_PUBLIC_LOGIN_ADMIN}`;
          const { email, password, user_role } = credentials;

          console.log("aaa", email, password, user_role);

          console.log(`API URL: ${apiUrl}`);
          console.log(`Credentials:`, { email, password, user_role });

          // Ensure apiUrl is defined
          if (!apiUrl) {
            throw new Error("API URL is not defined");
          }

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, user_role }),
          });

          console.log(`Response:`, response);

          if (response.ok) {
            const user = await response.json();
            console.log(`User:`, user);
            if (user?.message === "Login successful") {
              return user;
            } else {
              throw new Error("Login failed");
            }
          } else {
            throw new Error("Login failed");
          }
        } catch (error) {
          console.error(`Error in authorization:`, error);
          throw new Error(
            error.response?.data?.message || error.message || "Login failed"
          );
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log(user);

      return { ...token, ...user };
    },
    async session({ session, token }) {
      console.log(token);
      session.user = token;
      return session;
    },

    // async jwt({ user, token, trigger, session, account }) {
    //   console.log("account", account);

    //   return { ...token, ...user };
    // },

    // async session({ session, user, token, account, req, res }) {
    //   console.log(token, "token");

    //   session.user = token;
    //   return session;
    // },
  },
};

export default authOptions;
