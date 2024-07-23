import { ChannelType, SlashCommandBuilder } from "discord.js";
import type { TCommandInteraction } from "../../types/TClient";

export const commandBase = {
    slashData: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clears messages in the channel."),
    async execute(interaction: TCommandInteraction) {
        const { client } = interaction;
        await interaction.deferReply({ ephemeral: false });

        const channel = interaction.channel;

        if (channel?.type !== ChannelType.GuildText) {
            return client.reply(
                interaction,
                "This command can only be used in a text channel.",
                "Red"
            );
        }

        const messages = await channel.messages.fetch();

        if (!messages) {
            return client.reply(interaction, "No messages found.", "Red");
        }

        try {
            await channel.bulkDelete(messages);

            await client.reply(
                interaction,
                "Messages cleared successfully.",
                "Green"
            );
        } catch (error: any) {
            client.error("Failed to clear messages.", error);
            return client.reply(
                interaction,
                "Failed to clear messages.",
                "Red"
            );
        }
    },
};
