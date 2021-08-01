import { Configuration } from "../server";

export interface Error {
    readonly field: string;
    readonly message: string;
}

export type ServerResult<A> =
    | { isOk: true; body: A }
    | { isOk: false; genericErrors: string[]; fieldErrors: Error[] };

/**
 * simplifies the weird error handling in the generated code
 */
async function extractErrors<A>(p: Promise<A>): Promise<ServerResult<A>> {
    try {
        const body = await p;
        return { isOk: true, body };
    } catch (err) {
        const genericErrors: string[] = [];
        const fieldErrors: Error[] = [];
        if (err instanceof Response) {
            const body: unknown = await err.json();
            if (isRecord(body) && "message" in body && Array.isArray(body.message)) {
                for (const message of body.message) {
                    genericErrors.push("" + message);
                }
            } else {
                genericErrors.push("Unexpected error");
            }
        } else {
            genericErrors.push(unknownErrToString(err));
        }
        return { isOk: false, genericErrors, fieldErrors };
    }
}

function isRecord(x: unknown): x is Record<string, unknown> {
    return typeof x === "object" && x !== null;
}

function unknownErrToString(err: unknown): string {
    if (err == null) {
        return "null";
    } else {
        return "" + err;
    }
}

function createConfig(): Configuration {
    return new Configuration({ basePath: process.env.REACT_APP_BASE_URL });
}

export function serverRequest<A>(
    f: (config: Configuration) => Promise<A>,
): Promise<ServerResult<A>> {
    return extractErrors(f(createConfig()));
}
