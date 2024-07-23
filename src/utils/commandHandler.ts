import { Collection } from "discord.js";
import { readdirSync } from "fs";

import type { TClient } from "../types/TClient";

export default async function execute(client: TClient) {
    client.slashCommands = new Collection();
    client.slashDatas = [];

    // Handlers
    const commandFolders = readdirSync("./src/commands");

    await Promise.all(
        commandFolders.map(async (category) => {
            const commandFiles = readdirSync(
                `./src/commands/${category}`
            ).filter((file) => file.endsWith(".ts"));

            await Promise.all(
                commandFiles.map(async (file) => {
                    const command = await import(
                        `../commands/${category}/${file}`
                    );

                    if (command) {
                        if (
                            command.commandBase &&
                            command.commandBase.slashData
                        ) {
                            const slashCommand = command.commandBase;
                            client.slashDatas.push(
                                slashCommand.slashData.toJSON()
                            );
                            client.slashCommands.set(
                                slashCommand.slashData.name,
                                slashCommand
                            );

                            client.log(
                                `COMMAND LOADED: '${slashCommand.slashData.name}'`
                            );
                        }
                    }
                })
            );
        })
    );
}
