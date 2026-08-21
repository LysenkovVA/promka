import bcrypt from "bcryptjs"
import { PrismaClient } from "../.generated/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

// Необходимо использовать строку даты в формате utc,
// чтобы не учитывались часовые пояса при формировании даты
dayjs.extend(utc)

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

async function main() {
  const admin = await prisma.user.findFirst({
    where: { email: "admin@mail.ru" },
  })
  if (!admin) {
    // Seed data logic
    await prisma.user.create({
      data: {
        email: "admin@mail.ru",
        hashedPassword: bcrypt.hashSync("111", 10),
      },
    })
  }

  const candidate = await prisma.user.findFirst({
    where: { email: "user@mail.ru" },
  })
  if (!candidate) {
    // Seed data logic
    await prisma.user.create({
      data: {
        email: "user@mail.ru",
        hashedPassword: bcrypt.hashSync("111", 10),
        surname: "Лысенков",
        name: "Виктор",
        phoneNumber: "+79263357989",
        birthDate: dayjs.utc("1986-03-30").toDate(),
        teamMembers: {
          create: {
            workspace: {
              create: {
                company: {
                  create: {
                    name: "First company",
                  },
                },
              },
            },
            workspacePermissions: {
              create: {
                canRead: true,
                canDelete: true,
                canWrite: true,
              },
            },
          },
        },
        avatar: {
          create: {
            s3name: "test.jpg",
            size: 10000,
            mimeType: "image/jpeg",
            fileName: "test.jpg",
          },
        },
      },
    })
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
