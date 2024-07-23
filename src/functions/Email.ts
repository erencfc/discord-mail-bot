import { randomString } from "./Random";
import { createRule, getRuleByMail, getRules } from "./EmailRule";

export async function getEmails(): Promise<Array<string>> {
    const rules = await getRules();
    const emails = rules
        .filter((rule) => Boolean(rule.matchers[0].value))
        .map((rule) => rule.matchers[0].value);

    emails.sort();

    return emails as Array<string>;
}

export async function createRandomEmail(): Promise<string> {
    do {
        const email = `${randomString({
            length: 15,
            uppercase: false,
            lowercase: true,
            numbers: true,
        })}@${process.env.DOMAIN}`;
        const rule = await getRuleByMail(email);
        if (!rule) {
            return email;
        }
    } while (true);
}

export async function createRandomEmailWithRule() {
    const email = await createRandomEmail();
    const rule = await createRule(email);
    return { email, rule };
}
