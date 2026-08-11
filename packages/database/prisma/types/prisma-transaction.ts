import prisma from "../lib/prisma"

// export type PrismaTransaction = Omit<
//     PrismaCompany<Prisma.PrismaCompanyOptions, never, DefaultArgs>,
//     "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
// >;
export type PrismaTransaction = Omit<
  typeof prisma,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>
