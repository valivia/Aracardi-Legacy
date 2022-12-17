import { Prisma } from "@prisma/client";

export enum DatabaseErrorCode {
  UniqueViolation = "P2002",
}
export const isDatabaseError = (error: unknown, errorCode: DatabaseErrorCode): boolean => error instanceof Prisma.PrismaClientKnownRequestError && error.code === errorCode;
