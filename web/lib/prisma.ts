import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma: PrismaClient = global.prismaGlobal ?? new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.bjljtxyucgfuwyeqwlmf:LeonZürich25@db.bjljtxyucgfuwyeqwlmf.supabase.co:5432/postgres?sslmode=require"
    }
  }
});

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}
