import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      shopName: string;
      upiId: string;
    };
  }

  interface User {
    role: string;
    shopName: string;
    upiId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    shopName: string;
    upiId: string;
  }
}
