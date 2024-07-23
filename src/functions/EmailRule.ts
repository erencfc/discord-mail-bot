import axios, { type AxiosRequestConfig } from "axios";
import type { TRule } from "../types/TRule";
import type { TError } from "../types/TError";

const url = `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/email/routing/rules`;
const headers = {
    "Content-Type": "application/json",
    "X-Auth-Email": process.env.CLOUDFLARE_EMAIL as string,
    "X-Auth-Key": process.env.CLOUDFLARE_API_KEY as string,
};

export async function getRules(): Promise<Array<TRule>> {
    const options: AxiosRequestConfig = {
        url,
        headers,
        method: "GET",
    };

    try {
        const response = await axios.request(options);

        return response.data.result;
    } catch (error: any) {
        const message = error.response?.data?.errors[0]?.message || error;
        throw new Error("Error getting rules: " + message);
    }
}

export async function getRuleById(id: string): Promise<TRule> {
    const options: AxiosRequestConfig = {
        url: `${url}/${id}`,
        headers,
        method: "GET",
    };

    try {
        const response = await axios.request(options);

        return response.data.result;
    } catch (error: any) {
        const message = error.response?.data?.errors[0]?.message || error;
        throw new Error("Error getting rule: " + message);
    }
}

export async function getRuleByMail(mail: string): Promise<TRule | undefined> {
    const rules = await getRules();
    return rules.find((rule) => rule.matchers[0].value === mail);
}

export async function createRule(mail: string): Promise<TRule> {
    const options: AxiosRequestConfig = {
        url,
        headers,
        method: "POST",
        data: {
            enabled: true,
            actions: [{ type: "worker", value: ["email-worker"] }],
            matchers: [{ field: "to", type: "literal", value: mail }],
            name: `Rule created at ${new Date().toLocaleString(
                "tr-TR"
            )}: ${mail}`,
            priority: 0,
        },
    };

    try {
        const response = await axios.request(options);

        return response.data.result;
    } catch (error: any) {
        const message = error.response?.data?.errors[0]?.message || error;
        throw new Error("Error creating rule: " + message);
    }
}

export async function deleteRuleById(id: string): Promise<boolean> {
    const options: AxiosRequestConfig = {
        headers,
        url: `${url}/${id}`,
        method: "DELETE",
    };

    try {
        const response = await axios.request(options);

        return response.data.success;
    } catch (error: any) {
        const message = error.response?.data?.errors[0]?.message || error;
        throw new Error("Error deleting rule: " + message);
    }
}

export async function deleteRuleByMail(mail: string): Promise<boolean> {
    const rule = await getRuleByMail(mail);

    if (!rule) {
        throw new Error(`Rule for ${mail} not found`);
    }

    return await deleteRuleById(rule.id);
}
