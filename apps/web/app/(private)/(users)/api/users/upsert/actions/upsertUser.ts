"use server"

import { IUserEntity, UserEntitySchema } from "@/app/(private)/(users)"
import { ResponseData } from "@/lib/responses/ResponseData"
import { validateObject } from "@/lib/zod/validateObject"
import {
  prisma,
  prismaNonExistentId,
  PrismaTransaction,
} from "@workspace/database/prisma"
import { Prisma } from "@workspace/database/.generated/client"

export async function upsertUserAtTransaction(
  data: IUserEntity,
  prismaTransaction: PrismaTransaction
): Promise<ResponseData<IUserEntity | undefined>> {
  try {
    // Валидация данных
    const validatedData = await validateObject(UserEntitySchema, data)

    const upsertedData: IUserEntity = await prismaTransaction.user.upsert({
      where: { id: validatedData.id || prismaNonExistentId },
      /**
       * Создание новой записи, если идентификатор не задан
       */
      create: {
        // ...(photoId && {
        //     avatar: {
        //         connect: { id: photoId },
        //     },
        // }),
        email: validatedData.email!,
        hashedPassword: validatedData.hashedPassword!,
        surname: validatedData.surname ?? Prisma.skip,
        name: validatedData.name ?? Prisma.skip,
        birthDate: validatedData.birthDate ?? Prisma.skip,
      },
      /**
       * Обновление записи, если идентификатор задан
       */
      update: {
        // ...(photoId
        //     ? {
        //           avatar: {
        //               connect: { id: photoId },
        //           },
        //       }
        //     : {
        //           avatar: { disconnect: true },
        //       }),
        email: validatedData.email!,
        hashedPassword: validatedData.hashedPassword!,
        emailConfirmed: validatedData.emailConfirmed ?? Prisma.skip,
        phoneNumber: validatedData.phoneNumber ?? Prisma.skip,
        phoneNumberConfirmed: validatedData.phoneNumberConfirmed ?? Prisma.skip,
        surname: validatedData.surname ?? Prisma.skip,
        name: validatedData.name ?? Prisma.skip,
        birthDate: validatedData.birthDate ?? Prisma.skip,
      },
      include: {
        avatar: true,
      },
    })

    return ResponseData.Ok<IUserEntity>(
      JSON.parse(JSON.stringify(upsertedData)) as IUserEntity
    )
  } catch (error) {
    return ResponseData.InternalServerError(error)
  }
}

export async function upsertUser(
  data: IUserEntity
): Promise<ResponseData<IUserEntity | undefined>> {
  try {
    // Запуск транзакции
    return await prisma.$transaction(async (tx: PrismaTransaction) => {
      return await upsertUserAtTransaction(data, tx)
    })
  } catch (error) {
    return ResponseData.InternalServerError(error)
  }
}
