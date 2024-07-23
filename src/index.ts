import { readdirSync } from "fs";
import { Client, Partials } from "discord.js";
import type { TClient } from "./types/TClient";
import { config } from "dotenv";
config();

export const client = new Client({
    intents: ["Guilds", "GuildMessages", "GuildMembers", "MessageContent"],
    partials: [
        Partials.GuildMember,
        Partials.Channel,
        Partials.Message,
        Partials.User,
    ],
}) as TClient;

readdirSync("./src/utils").map(async (file) => {
    const util = await import(`./utils/${file}`).then((m) => m.default);
    util(client);
});

client.login(process.env.DISCORD_BOT_TOKEN as string);
