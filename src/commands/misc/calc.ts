import { SlashCommandBuilder } from "discord.js";
import type { TCommandInteraction } from "../../types/TClient";

export const commandBase = {
    slashData: new SlashCommandBuilder()
        .setName("calc")
        .setDescription("Calculates Eldorado commissions.")
        .addNumberOption((option) =>
            option
                .setName("sale_price")
                .setDescription("Sale price.")
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName("payooner_dollar_exchange")
                .setDescription("Payooner dollar exchange.")
                .setRequired(true)
        ),
    async execute(interaction: TCommandInteraction) {
        const { client } = interaction;

        await interaction.deferReply({ ephemeral: true });

        const sale_price = interaction.options.getNumber("sale_price")!;
        const eldo_comm = 15;
        const payooner_comm_percent = 4;
        const payooner_comm_dollar = 2;
        const payooner_dollar_exchange = interaction.options.getNumber(
            "payooner_dollar_exchange"
        )!;

        const eldo_money = sale_price - (sale_price * eldo_comm) / 100;
        const payooner_para =
            eldo_money -
            (eldo_money * payooner_comm_percent) / 100 -
            payooner_comm_dollar;

        client.reply(
            interaction,
            `**Eldorado'ya geçen para: \`${eldo_money} $\`\nPayooner'e geçen para: \`${payooner_para} $\`\nBankaya geçen para: \`${(
                payooner_para * payooner_dollar_exchange
            ).toFixed(2)} ₺\`**`
        );
    },
};
