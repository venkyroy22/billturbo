import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = (req: any, res: any) => {
  console.log(`[NextAuth] ${req.method} request to ${req.url}`);
  return NextAuth(authOptions)(req, res);
};

export { handler as GET, handler as POST };
