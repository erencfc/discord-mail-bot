import bcrypt from "bcrypt";
import { randomString } from "../../functions/Random";
import prisma from "../../lib/db/prisma";
import type { TCommandInteraction } from "../../types/TClient";
import { createRandomEmailWithRule } from "../../functions/Email";
import { createRule, getRuleByMail } from "../../functions/EmailRule";
import { accountExists } from "../../functions/Account";
import { createMailChannel, getMailChannel } from "../../functions/Discord";
import type { GuildTextBasedChannel } from "discord.js";
import { addAccount } from "../../lib/db/account";

export default async (interaction: TCommandInteraction) => {
    const { client, options } = interaction;

    const username = options.get("username", true).value as string;
    const password = options.get("password")?.value || randomString({});
    let emailOption = options.get("email")?.value;

    if (emailOption && !emailOption.toString().includes("@")) {
        emailOption =
            emailOption.toString().replace(/ /g, "") + "@" + process.env.DOMAIN;
    } else if (emailOption && emailOption.toString().includes("@")) {
        emailOption =
            emailOption
                .toString()
                .replace(/ /g, "")
                .toLowerCase()
                .replace(/ç/g, "c")
                .replace(/ğ/g, "g")
                .replace(/ı/g, "i")
                .replace(/ö/g, "o")
                .replace(/ş/g, "s")
                .replace(/ü/g, "u")
                .split("@")[0] +
            "@" +
            process.env.DOMAIN;
    }

    const isUsernameExisting = await accountExists({ username });
    if (isUsernameExisting) {
        await client.reply(
            interaction,
            `Username \`${username}\` already exists in the database.`,
            "Red"
        );
        return;
    }

    if (emailOption) {
        const isEmailExisting = await accountExists({
            email: emailOption as string,
        });
        if (isEmailExisting) {
            await client.reply(
                interaction,
                `Email \`${emailOption}\` already exists in the database.`,
                "Red"
            );
            return;
        }
    }

    let email: string;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password as string, salt);

    if (emailOption) {
        email = emailOption as string;
        const ruleByMail = await getRuleByMail(email);

        if (!ruleByMail) {
            await createRule(email);
        }
    } else {
        const data = await createRandomEmailWithRule();
        email = data.email;
    }

    let channelId =
        (await getMailChannel(email))?.id ||
        (await createMailChannel(email)).id;

    try {
        const account = await addAccount({
            username,
            password: hashedPassword,
            channelId,
            email,
        });

        await client.reply(
            interaction,
            `Added account information.\nChannel: <#${account.channelId}>`
        );

        await client.channels.fetch(account.channelId).then(async (channel) => {
            const mailChannel = channel as GuildTextBasedChannel;
            const message = await mailChannel.send(
                `Username: \`${account.username}\`\nPassword (click to reveal): ||\`${password}\`||\nEmail: \`${account.email}\``
            );

            await message.pin();
        });
    } catch (error: any) {
        const code = error.code;
        console.log(code);

        await client.reply(interaction, "Failed to add account information.");
        return client.error(`Failed to add account information.`, error);
    }
};
