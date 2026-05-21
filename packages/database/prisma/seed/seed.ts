import bcrypt from "bcryptjs"
import { PrismaClient } from "../.generated/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

async function main() {
  const candidate = await prisma.user.findFirst({
    where: { email: "user@mail.ru" },
  })
  if (!candidate) {
    // Seed data logic
    await prisma.user.create({
      data: {
        email: "user@mail.ru",
        hashedPassword: bcrypt.hashSync("111", 10),
      },
    })
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
