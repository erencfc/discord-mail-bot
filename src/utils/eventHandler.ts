import { readdirSync } from "fs";
import type { TClient } from "../types/TClient";

export default async function execute(client: TClient) {
    const eventFiles = readdirSync("./src/events").filter((file) =>
        file.endsWith(".ts")
    );

    await Promise.all(
        eventFiles.map(async (file: string) => {
            const event = await import(`../events/${file}`).then(
                (m) => m.default
            );

            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
            client.log(`EVENT LOADED: '${event.name}'`);
        })
    );

    // Process Listeners
    process.on("unhandledRejection", (e) => {
        console.log(e);
    });
    process.on("uncaughtException", (e) => {
        console.log(e);
    });
    process.on("uncaughtExceptionMonitor", (e) => {
        console.log(e);
    });
}
