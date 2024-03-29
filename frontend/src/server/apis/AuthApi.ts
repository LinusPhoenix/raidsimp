/* tslint:disable */
/* eslint-disable */
/**
 * RaidSIMP OpenAPI Spec
 * Manage your raid teams, enhanced with data from the Blizzard API.
 *
 * The version of the OpenAPI document: 0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';

/**
 * 
 */
export class AuthApi extends runtime.BaseAPI {

    /**
     * Logs the user out from the app by clearing the token cookie.
     */
    async authControllerLogoutRaw(): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/auth/logout`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Logs the user out from the app by clearing the token cookie.
     */
    async authControllerLogout(): Promise<void> {
        await this.authControllerLogoutRaw();
    }

    /**
     * Validates battlenet\'s access token,        creates and/or logs in the user in this app, then issues a JWT and returns it as a cookie.        Send this cookie with further requests to be authenticated.        Finally, redirects user to REDIRECT_URL_AFTER_LOGIN, which should be set to the frontend\'s main page.
     * Callback for battlenet Oauth2. Do not call directly.
     */
    async bNetOauth2ControllerBnetCallbackRaw(): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/oauth/bnet/callback`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Validates battlenet\'s access token,        creates and/or logs in the user in this app, then issues a JWT and returns it as a cookie.        Send this cookie with further requests to be authenticated.        Finally, redirects user to REDIRECT_URL_AFTER_LOGIN, which should be set to the frontend\'s main page.
     * Callback for battlenet Oauth2. Do not call directly.
     */
    async bNetOauth2ControllerBnetCallback(): Promise<void> {
        await this.bNetOauth2ControllerBnetCallbackRaw();
    }

    /**
     * Login using battlenet Oauth2. Redirects to battlenet so the user can login there.             Do not call directly, use your browser.
     */
    async bNetOauth2ControllerBnetLoginRaw(): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/oauth/bnet`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Login using battlenet Oauth2. Redirects to battlenet so the user can login there.             Do not call directly, use your browser.
     */
    async bNetOauth2ControllerBnetLogin(): Promise<void> {
        await this.bNetOauth2ControllerBnetLoginRaw();
    }

}
