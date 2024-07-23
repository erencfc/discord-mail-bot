export type TChannel = {
    id: string;
    type: number;
    last_message_id: string | null;
    flags: number;
    guild_id: string;
    name: string;
    parent_id: string | null;
    rate_limit_per_user: number;
    topic: string | null;
    position: number;
    permission_overwrites: [];
    nsfw: boolean;
};
