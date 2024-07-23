import type { TCommandInteraction } from "../../types/TClient";
import { createRandomEmailWithRule } from "../../functions/Email";
import { createRule, getRuleByMail } from "../../functions/EmailRule";
import { accountExists } from "../../functions/Account";
import { createMailChannel, getMailChannel } from "../../functions/Discord";

export default async (interaction: TCommandInteraction) => {
    const { client, options } = interaction;

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

    let email: string;

    if (emailOption) {
        email = emailOption as string;
        const isEmailExisting = await accountExists({ email });
        if (isEmailExisting) {
            await client.reply(
                interaction,
                `Email \`${emailOption}\` already exists in the database.`,
                "Red"
            );
            return;
        }

        const ruleByMail = await getRuleByMail(email);
        if (!ruleByMail) {
            await createRule(email);
        }
    } else {
        const data = await createRandomEmailWithRule();
        email = data.email;
    }

    try {
        let channelId =
            (await getMailChannel(email))?.id ||
            (await createMailChannel(email)).id;

        await client.reply(
            interaction,
            `Added email information.\nChannel: <#${channelId}>`
        );
    } catch (error: any) {
        const code = error.code;
        console.log(code);

        await client.reply(interaction, "Failed to add email information.");
        return client.error(`Failed to add email information.`, error);
    }
};
