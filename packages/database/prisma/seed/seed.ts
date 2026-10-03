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
        userRole: "ADMINISTRATOR",
        surname: "Лысенков",
        name: "Виктор",
        patronymic: "Андреевич",
        phoneNumber: "+79263357989",
        birthDate: dayjs.utc("1986-03-30").toDate(),
      },
    })
  }

  const candidate = await prisma.user.findFirst({
    where: { email: "user@mail.ru" },
  })
  if (!candidate) {
    const user = await prisma.user.create({
      data: {
        email: "user@mail.ru",
        hashedPassword: bcrypt.hashSync("111", 10),
        userRole: "USER",
        surname: "Лысенкова",
        name: "Диана",
        patronymic: "Олеговна",
        phoneNumber: "+79263877681",
        birthDate: dayjs.utc("1986-11-24").toDate(),
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

    const userWorkspace = await prisma.workspace.create({
      data: {
        company: {
          create: {
            name: 'ООО "СпецСтройТехнологии-М"',
          },
        },
        berthes: {
          create: [
            {
              name: "Начальник службы ОТ и ПБ",
              berthType: { create: { name: "ИТР" } },
            },
            {
              name: "Стропальщик",
              berthType: { create: { name: "Рабочие" } },
            },
          ],
        },
      },
    })

    const userTeamMember = await prisma.teamMember.create({
      data: {
        user: { connect: { id: user.id } },
        workspace: { connect: { id: userWorkspace.id } },
        workspacePermissions: {
          create: {
            // БУДУТ СОЗДАНЫ ЗНАЧЕНИЯ ПО УМОЛЧАНИЮ
          },
        },
        workspaceRole: "WS_ADMINISTRATOR",
      },
    })

    const userWorkspaceBerthType1 = await prisma.berthType.create({
      data: {
        name: "ИТР",
        workspace: { connect: { id: userWorkspace.id } },
      },
    })

    const userWorkspaceBerthType2 = await prisma.berthType.create({
      data: {
        name: "Рабочие",
        workspace: { connect: { id: userWorkspace.id } },
      },
    })

    const userWorkspaceBerth1 = await prisma.berth.create({
      data: {
        name: "Стропальщик",
        workspace: { connect: { id: userWorkspace.id } },
        berthType: { connect: { id: userWorkspaceBerthType2.id } },
      },
    })

    const userWorkspaceBerth2 = await prisma.berth.create({
      data: {
        name: "Арматурщик",
        workspace: { connect: { id: userWorkspace.id } },
        berthType: { connect: { id: userWorkspaceBerthType2.id } },
      },
    })

    const userWorkspaceBerth3 = await prisma.berth.create({
      data: {
        name: "Бетонщик",
        workspace: { connect: { id: userWorkspace.id } },
        berthType: { connect: { id: userWorkspaceBerthType2.id } },
      },
    })

    const userWorkspaceBerth4 = await prisma.berth.create({
      data: {
        name: "Директор",
        workspace: { connect: { id: userWorkspace.id } },
        berthType: { connect: { id: userWorkspaceBerthType1.id } },
      },
    })

    const userWorkspaceBerth5 = await prisma.berth.create({
      data: {
        name: "Инженер по ОТ и ТБ",
        workspace: { connect: { id: userWorkspace.id } },
        berthType: { connect: { id: userWorkspaceBerthType1.id } },
      },
    })
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
