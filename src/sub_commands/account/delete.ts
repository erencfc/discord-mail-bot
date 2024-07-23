import { BaseGuildTextChannel, ChannelType } from "discord.js";
import { deleteRuleByMail } from "../../functions/EmailRule";
import { deleteAccountByEmail, getAccount } from "../../lib/db/account";
import type { TCommandInteraction } from "../../types/TClient";

export default async (interaction: TCommandInteraction) => {
    const reply = async (content: string) => {
        await client.reply(interaction, content, "DarkGold");
    };

    const { client, options } = interaction;

    const emailOption = options.getString("email", false);
    const usernameOption = options.getString("username", false);

    let email: string | null = null;

    if (!emailOption && !usernameOption) {
        await reply("Please provide an email or username.");
        return;
    }

    if (emailOption && usernameOption) {
        await reply("Please provide only an email or username.");
        return;
    }

    if (emailOption) {
        email = emailOption;
    } else {
        const account = await getAccount({
            username: usernameOption as string,
        });
        if (!account) {
            client.reply(
                interaction,
                `**Username \`${usernameOption}\` not found.**`,
                "DarkRed"
            );
            return;
        }
        email = account.email;
    }

    await reply("Removing email rule from Cloudflare...");

    let cfString: string = "**Done!**";
    try {
        await deleteRuleByMail(email);
    } catch (error: any) {
        client.error("Error deleting email from Cloudflare", error);
        cfString = "**Failed!**";
    }

    await reply(
        `Removing email rule from Cloudflare... ${cfString}\n\nDeleting the account from database that has this email...`
    );

    let dbString: string = "**Done!**";
    try {
        await deleteAccountByEmail(email);
    } catch (error: any) {
        client.error("Error deleting account from database", error);
        dbString = "**Failed!**";
    }

    await reply(
        `Removing email rule from Cloudflare... ${cfString}\n\nDeleting the account from database that has this email... ${dbString}\n\nDeleting the email channel...`
    );

    let dcString: string = "**Done!**";
    try {
        const guild = await client.guilds.fetch(
            process.env.DISCORD_GUILD_ID as string
        );
        await guild.channels.fetch();

        const channel = client.channels.cache.find((c) => {
            if (c.type === ChannelType.GuildText) {
                const channel = c as BaseGuildTextChannel;
                return channel.topic === email;
            }
        });

        if (channel) {
            await channel.delete();
        } else {
            throw new Error("Channel not found.");
        }
    } catch (error: any) {
        client.error("Error deleting email channel", error);
        dcString = "**Failed!**";
    }

    await reply(
        `Removing email rule from Cloudflare... ${cfString}\n\nDeleting the account from database that has this email... ${dbString}\n\nDeleting the email channel... ${dcString}`
    );
};
