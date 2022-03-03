import { Configuration } from "../server";

const CONFIG: Configuration = new Configuration({
    basePath: process.env.REACT_APP_BASE_URL,
    credentials: "include",
});

export interface FieldError {
    readonly field: string;
    readonly message: string;
}

export interface ResultOk<A> {
    readonly isOk: true;
    readonly body: A;
}

export interface ResultErr {
    readonly isOk: false;
    readonly status: number | null;
    readonly genericErrors: readonly string[];
    readonly fieldErrors: readonly FieldError[];
    readonly source: unknown;
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
        const fieldErrors: FieldError[] = [];
        let status: number | null = null;
        if (err instanceof Response) {
            status = err.status;
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
        return { isOk: false, status, genericErrors, fieldErrors, source: err };
    }
}

export class ServerRequestError extends Error {
    constructor(
        readonly status: number | null,
        readonly genericErrors: readonly string[],
        readonly fieldErrors: readonly FieldError[],
        readonly source: unknown,
    ) {
        super("Error in serverRequest");
    }
}

/**
 * Provides a configuation for the client.
 *
 * Intercepts errors and wraps them in a more structured ServerRequestError.
 */
export async function serverRequestThrows<A>(f: (config: Configuration) => Promise<A>): Promise<A> {
    const result = await serverRequest(f);
    if (result.isOk) {
        return result.body;
    } else {
        const { status, genericErrors, fieldErrors, source } = result;
        throw new ServerRequestError(status, genericErrors, fieldErrors, source);
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
