import moment from "moment";
import type { TClient, TCommandInteraction } from "../types/TClient";
import { Colors, type APIEmbed } from "discord.js";

export default async function execute(client: TClient) {
    client.log = (message: string) => {
        console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
    };
    client.error = (message: string, error: Error) => {
        console.error(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
        console.error(error);
    };
    type ColorValues = keyof typeof Colors;
    client.reply = async (
        interaction: TCommandInteraction,
        message: string,
        color: ColorValues = "Blurple",
        options?: APIEmbed
    ) => {
        const embed: APIEmbed = {
            description: message,
            color: Colors[color],
            ...options,
        };

        await interaction.editReply({ embeds: [embed] });
    };
}
