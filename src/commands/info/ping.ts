import { SlashCommandBuilder } from "discord.js";
import type { TCommandInteraction } from "../../types/TClient";

export const commandBase = {
    slashData: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with bot's ping!"),
    async execute(interaction: TCommandInteraction) {
        const { client } = interaction;

        const message = await interaction.deferReply({ fetchReply: true });
        await interaction.editReply(
            `API Latency: \`${client.ws.ping} ms\`\nClient Ping: \`${
                message.createdTimestamp - interaction.createdTimestamp
            } ms\``
        );
    },
};
