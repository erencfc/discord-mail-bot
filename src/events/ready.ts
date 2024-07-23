import { ActivityType, Events, REST, Routes } from "discord.js";
import type { TClient } from "../types/TClient";

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: TClient) {
        const rest = new REST({ version: "10" }).setToken(
            process.env.DISCORD_BOT_TOKEN as string
        );
        client.user?.setPresence({
            activities: [
                {
                    name: "Developed by kleesd",
                    type: ActivityType.Watching,
                },
            ],
            status: "idle",
        });

        client.log(client.user?.username + " is ready.");

        await client.guilds.fetch();
        const guild = client.guilds.cache.first();

        if (!guild) {
            return client.log("Guild not found.");
        }

        try {
            const commands = await guild.commands.fetch();

            if (commands.size != client.slashCommands.size) {
                await rest.put(
                    Routes.applicationGuildCommands(
                        client.user?.id as string,
                        guild.id
                    ),
                    {
                        body: client.slashDatas,
                    }
                );

                client.log("Successfully reloaded application (/) commands.");
            } else {
                client.log("Application (/) commands are already up to date.");
            }
        } catch (error) {
            client.log(
                "An error occurred while refreshing application (/) commands."
            );
            console.error(error);
        }
    },
};
