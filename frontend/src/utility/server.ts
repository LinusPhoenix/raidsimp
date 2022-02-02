import { Configuration } from "../server";

const CONFIG: Configuration = new Configuration({
    basePath: process.env.REACT_APP_BASE_URL,
    credentials: "include",
});

export interface Error {
    readonly field: string;
    readonly message: string;
}

export interface ResultOk<A> {
    readonly isOk: true;
    readonly body: A;
}

export interface ResultErr {
    readonly isOk: false;
    readonly genericErrors: readonly string[];
    readonly fieldErrors: readonly Error[];
}

export type ServerResult<A> = ResultOk<A> | ResultErr;

/**
 * handles configuration of the client and simplifies the weird error handling in the generated code
 */
export async function serverRequest<A>(
    f: (config: Configuration) => Promise<A>,
): Promise<ServerResult<A>> {
    try {
        const body = await f(CONFIG);
        return { isOk: true, body };
    } catch (err) {
        const genericErrors: string[] = [];
        const fieldErrors: Error[] = [];
        if (err instanceof Response) {
            const body: unknown = await err.json();
            if (isRecord(body) && "message" in body) {
                if (Array.isArray(body.message)) {
                    for (const message of body.message) {
                        genericErrors.push("" + message);
                    }
                } else {
                    genericErrors.push("" + body.message);
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
