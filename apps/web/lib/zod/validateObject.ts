import { z as z4, ZodError as ZodErrorZ4 } from "zod/v4"

export function formatZodErrorToMessages(error: ZodErrorZ4): string[] {
  return error.issues?.map((issue) => formatZodIssue(issue.message, issue.path))
}

export function formatZodIssue(message: string, path: PropertyKey[]): string {
  return `${message} (поле [${path}]) `
}

export async function validateObject<S extends z4.ZodType<z4.infer<S>, any>>(
  schema: S,
  data: z4.infer<S>
): Promise<z4.infer<S>> {
  const result = schema.safeParse(data)

  if (result.error) {
    // throw new Error(result.error.message);
    throw new ZodErrorZ4(result.error.issues)
  }

  return result.data as z4.infer<S>
}

// export async function validateObject<S extends z.ZodType<z.infer<S>, any>>(
//     schema: S,
//     data: z.infer<S>,
// ): Promise<z.infer<S>> {
//     const result = schema.safeParse(data);
//
//     if (!result.success) {
//         if (result.error?.errors) {
//             throw new ZodError<S>(result.error!.errors);
//         } else {
//             throw new ZodError<S>([
//                 {
//                     message:
//                         "Неизвестная ошибка в функции валидации (validateObject)",
//                     path: ["validateObject"],
//                     code: "custom",
//                 },
//             ]);
//         }
//     } else {
//         return result.data as z.infer<S>;
//     }
// }
//
// export function validateObjectSync<S extends z.ZodType<z.infer<S>, any>>(
//     schema: S,
//     data: z.infer<S>,
// ): z.infer<S> {
//     const result = schema.safeParse(data);
//
//     if (!result.success) {
//         if (result.error?.errors) {
//             throw new ZodError<S>(result.error!.errors);
//         } else {
//             throw new ZodError<S>([
//                 {
//                     message:
//                         "Неизвестная ошибка в функции валидации (validateObject)",
//                     path: ["validateObject"],
//                     code: "custom",
//                 },
//             ]);
//         }
//     } else {
//         return result.data as z.infer<S>;
//     }
// }
