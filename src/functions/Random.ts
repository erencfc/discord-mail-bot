export function randomString({
    length = 15,
    uppercase = true,
    lowercase = true,
    numbers = true,
}: {
    length?: number;
    uppercase?: boolean;
    lowercase?: boolean;
    numbers?: boolean;
}): string {
    if (!uppercase && !lowercase && !numbers) {
        throw new Error(
            "At least one of uppercase, lowercase or numbers must be true"
        );
    }

    let characters = "";

    if (uppercase) {
        characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    if (lowercase) {
        characters += "abcdefghijklmnopqrstuvwxyz";
    }
    if (numbers) {
        characters += "0123456789";
    }

    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return result;
}
