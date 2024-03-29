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
import {
    User,
    UserFromJSON,
    UserToJSON,
} from '../models';

/**
 * 
 */
export class UsersApi extends runtime.BaseAPI {

    /**
     * Deletes the currently logged in user\'s account and all associated data (raid teams, etc).
     */
    async usersControllerDeleteUserRaw(): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/users`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes the currently logged in user\'s account and all associated data (raid teams, etc).
     */
    async usersControllerDeleteUser(): Promise<void> {
        await this.usersControllerDeleteUserRaw();
    }

    /**
     * Returns information about the currently logged in user.
     */
    async usersControllerGetUserInfoRaw(): Promise<runtime.ApiResponse<User>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/users/whoami`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     * Returns information about the currently logged in user.
     */
    async usersControllerGetUserInfo(): Promise<User> {
        const response = await this.usersControllerGetUserInfoRaw();
        return await response.value();
    }

}
