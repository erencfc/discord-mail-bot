import { readdirSync } from "fs";
import { SlashCommandBuilder } from "discord.js";
import type { TCommandInteraction } from "../../types/TClient";

export const commandBase = {
    slashData: new SlashCommandBuilder()
        .setName("add")
        .setDescription("Adds account/email.")
        .addSubcommand((subCommand) =>
            subCommand
                .setName("account")
                .setDescription("Adds account.")
                .addStringOption((option) =>
                    option
                        .setName("username")
                        .setDescription("Username of the account.")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("password")
                        .setDescription("Password of the account.")
                        .setRequired(false)
                        .setMinLength(8)
                        .setMaxLength(30)
                )
                .addStringOption((option) =>
                    option
                        .setName("email")
                        .setDescription("Email of the account.")
                        .setRequired(false)
                        .setAutocomplete(true)
                        .setMinLength(8)
                        .setMaxLength(40)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("email")
                .setDescription("Adds email.")
                .addStringOption((option) =>
                    option
                        .setName("email")
                        .setDescription("Email you want to add.")
                        .setRequired(false)
                        .setMinLength(8)
                        .setMaxLength(40)
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
