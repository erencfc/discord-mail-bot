import type { AutocompleteInteraction } from "discord.js";
import { getEmails } from "../functions/Email";

export default async (interaction: AutocompleteInteraction) => {
    const focusedOption = interaction.options.getFocused(true);

    const emails = await getEmails();

    const filteredChoices = emails.filter((email) =>
        email.toLowerCase().includes(focusedOption.value.toLowerCase())
    );

    const results = filteredChoices.map((email) => ({
        name: email,
        value: email,
    }));

    await interaction.respond(results.slice(0, 25)).catch(() => {});
};
