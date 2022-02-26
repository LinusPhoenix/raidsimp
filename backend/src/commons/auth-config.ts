import { CookieOptions } from "express";

export class AuthConfig {
    public static readonly TOKEN_COOKIE_NAME: string = "accessToken";

    public static readonly TOKEN_COOKIE_OPTIONS: CookieOptions = {
        sameSite: "strict",
        secure: true,
        httpOnly: true,
    };
}
