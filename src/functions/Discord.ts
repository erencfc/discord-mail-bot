import axios, { type AxiosRequestConfig } from "axios";
import type { TChannel } from "../types/TChannel";

export async function createMailChannel(mail: string): Promise<TChannel> {
    const url = `${process.env.DISCORD_API_URL}/guilds/${process.env.DISCORD_GUILD_ID}/channels`;

    const options: AxiosRequestConfig = {
        url,
        method: "POST",
        headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            "Content-Type": "application/json",
        },
        data: {
            name: mail.split("@")[0],
            type: 0,
            parent_id: process.env.DISCORD_CATEGORY_ID,
            topic: mail,
        },
    };

    const channel = (await axios.request(options)).data;
    return channel;
}

export async function getMailChannel(
    mail: string
): Promise<TChannel | undefined> {
    const url = `${process.env.DISCORD_API_URL}/guilds/${process.env.DISCORD_GUILD_ID}/channels`;

    const options: AxiosRequestConfig = {
        url,
        method: "GET",
        headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            "Content-Type": "application/json",
        },
    };

    const channels = (await axios.request(options)).data;
    return channels.find((channel: TChannel) => channel.topic === mail);
}
