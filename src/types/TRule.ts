export type TRule = {
    id: string;
    tag: string;
    name: string;
    matchers: [
        {
            type: string;
            field?: string;
            value?: string;
        }
    ];
    actions: [
        {
            type: string;
            value?: string[];
        }
    ];
    enabled: boolean;
    priority: number;
};
