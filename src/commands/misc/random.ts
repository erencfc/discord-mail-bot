import { SlashCommandBuilder } from "discord.js";
import type { TCommandInteraction } from "../../types/TClient";
import { randomString } from "../../functions/Random";

export const commandBase = {
    slashData: new SlashCommandBuilder()
        .setName("random")
        .setDescription("Creates random string.")
        .addNumberOption((option) =>
            option
                .setName("length")
                .setDescription("Length of the string. (Default: 15)")
                .setRequired(false)
        )
        .addBooleanOption((option) =>
            option
                .setName("uppercase")
                .setDescription(
                    "Includes uppercase characters. (Default: true)"
                )
                .setRequired(false)
        )
        .addBooleanOption((option) =>
            option
                .setName("lowercase")
                .setDescription(
                    "Includes lowercase characters. (Default: true)"
                )
                .setRequired(false)
        )
        .addBooleanOption((option) =>
            option
                .setName("numbers")
                .setDescription("Includes numbers. (Default: true)")
                .setRequired(false)
        ),
    async execute(interaction: TCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const length = interaction.options.getNumber("length") ?? 15;
        const uppercase = interaction.options.getBoolean("uppercase") ?? true;
        const lowercase = interaction.options.getBoolean("lowercase") ?? true;
        const numbers = interaction.options.getBoolean("numbers") ?? true;

        const string = randomString({
            length,
            uppercase,
            lowercase,
            numbers,
        });

        await interaction.client.reply(
            interaction,
            `Here's the random string:\n\n\`${string}\``
        );
    },
};
