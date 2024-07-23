import { readdirSync } from "fs";
import { SlashCommandBuilder } from "discord.js";
import type { TCommandInteraction } from "../../types/TClient";

export const commandBase = {
    slashData: new SlashCommandBuilder()
        .setName("delete")
        .setDescription("Deletes account/email.")
        .addSubcommand((subCommand) =>
            subCommand
                .setName("account")
                .setDescription("Deletes account.")
                .addStringOption((option) =>
                    option
                        .setName("username")
                        .setDescription("Username of the account.")
                        .setRequired(false)
                        .setAutocomplete(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("email")
                        .setDescription("Email of the account.")
                        .setRequired(false)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("email")
                .setDescription("Deletes email.")
                .addStringOption((option) =>
                    option
                        .setName("email")
                        .setDescription("Email you want to delete.")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        ),
    async execute(interaction: TCommandInteraction) {
        const subCommand = interaction.options.getSubcommand();
        await interaction.deferReply({ ephemeral: true });

        const file = (
            await import(
                `../../sub_commands/${subCommand}/${interaction.commandName}.ts`
            )
        )?.default;

        await file(interaction);
    },
};
