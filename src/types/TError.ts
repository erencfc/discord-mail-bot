export type TError = {
    result: unknown;
    success: boolean;
    errors: [
        {
            code: number;
            message: string;
        }
    ];
    messages: [
        {
            code: number;
            message: string;
        }
    ];
};
