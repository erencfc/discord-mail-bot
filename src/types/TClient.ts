import type {
    APIEmbed,
    ChatInputCommandInteraction,
    Client,
    Collection,
    Colors,
    SlashCommandBuilder,
} from "discord.js";

export type TCommandInteraction = Omit<
    ChatInputCommandInteraction,
    "client"
> & {
    client: TClient;
};
export type TSlashCommand = {
    name: string;
    description: string;
    execute: (interaction: TCommandInteraction) => Promise<void>;
};

type ColorValues = keyof typeof Colors;

export type TClient = {
    slashCommands: Collection<string, TSlashCommand>;
    slashDatas: SlashCommandBuilder[];
    log: (message: string) => void;
    error: (message: string, error: Error) => void;
    reply: (
        interaction: TCommandInteraction,
        message: string,
        color?: ColorValues,
        options?: APIEmbed
    ) => Promise<void>;
} & Client;
