import type { Prisma } from "@prisma/client";
import prisma from "./prisma";

export const getAccount = async (where: Prisma.AccountWhereUniqueInput) => {
    // Get account from the database
    const account = await prisma.account.findUnique({ where });

    return account;
};

export const addAccount = async ({
    username,
    password,
    channelId,
    email,
}: {
    username: string;
    password: string;
    channelId: string;
    email: string;
}) => {
    // Add account to the database
    const account = await prisma.account.create({
        data: {
            username,
            password,
            channelId,
            email,
        },
    });

    return account;
};

export const deleteAccountByEmail = async (email: string) => {
    // Delete account from the database
    const deletedAccount = await prisma.account.delete({ where: { email } });

    if (!deletedAccount) {
        throw new Error("Account not found.");
    }

    return deletedAccount;
};
