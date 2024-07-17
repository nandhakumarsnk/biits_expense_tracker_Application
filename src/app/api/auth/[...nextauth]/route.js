// pages/api/auth/[...nextauth].js
import authOptions from "@/lib/configs/auth/authOptions";
import NextAuth from "next-auth";

console.log("initiallised");
const handler = NextAuth(authOptions);

export { handler as POST, handler as GET };
