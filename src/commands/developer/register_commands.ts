import { REST, Routes, SlashCommandBuilder } from "discord.js";
import type { TCommandInteraction } from "../../types/TClient";

export const commandBase = {
    slashData: new SlashCommandBuilder()
        .setName("register_commands")
        .setDescription("Registers all commands."),
    async execute(interaction: TCommandInteraction) {
        const { client } = interaction;
        await interaction.deferReply({ ephemeral: true });

        const rest = new REST({ version: "10" }).setToken(
            process.env.DISCORD_BOT_TOKEN as string
        );

        await rest.put(
            Routes.applicationGuildCommands(
                client.user?.id as string,
                interaction.guildId as string
            ),
            {
                body: client.slashDatas,
            }
        );

        await client.reply(interaction, "Commands registered successfully.");
    },
};
