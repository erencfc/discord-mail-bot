import type { Prisma } from "@prisma/client";
import prisma from "../lib/db/prisma";

export async function accountExists(
    where: Prisma.AccountWhereUniqueInput
): Promise<boolean> {
    const account = await prisma.account.findUnique({ where });
    return Boolean(account);
}
