import { readdirSync } from "fs";
import { AutocompleteInteraction, Events } from "discord.js";
import type { TCommandInteraction } from "../types/TClient";

export default {
    name: Events.InteractionCreate,
    async execute(interaction: TCommandInteraction) {
        if (!interaction.guild || !interaction.member || interaction.user.bot)
            return;

        if (interaction.isChatInputCommand()) {
            try {
                const command = interaction.client.slashCommands.get(
                    interaction.commandName
                );

                if (!command) {
                    return interaction.reply({
                        content: "Command not found.",
                        ephemeral: true,
                    });
                }

                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: "There was an error while executing this command.",
                    ephemeral: true,
                });
            }
        } else if (interaction.isAutocomplete()) {
            const autoCompleteFiles = readdirSync(
                "./src/auto_completes"
            ).filter((file) => file.endsWith(".ts"));

            const autoComplete = autoCompleteFiles.find((file) =>
                file.startsWith(
                    (interaction as unknown as AutocompleteInteraction)
                        .commandName
                )
            );

            if (!autoComplete) return;

            const autoCompleteFunction = await import(
                `../auto_completes/${autoComplete}`
            ).then((m) => m.default);

            await autoCompleteFunction(interaction as AutocompleteInteraction);
        }
    },
};
