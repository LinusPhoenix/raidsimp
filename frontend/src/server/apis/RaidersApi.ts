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
    CreateRaiderDto,
    CreateRaiderDtoFromJSON,
    CreateRaiderDtoToJSON,
    Raider,
    RaiderFromJSON,
    RaiderToJSON,
    RaiderOverviewDto,
    RaiderOverviewDtoFromJSON,
    RaiderOverviewDtoToJSON,
} from '../models';

export interface RaidersControllerAddRaiderToRaidTeamRequest {
    raidTeamId: string;
    createRaiderDto: CreateRaiderDto;
}

export interface RaidersControllerGetDetailsRequest {
    raidTeamId: string;
    raiderId: string;
}

export interface RaidersControllerGetOverviewRequest {
    raidTeamId: string;
    raiderId: string;
    caching: string;
}

export interface RaidersControllerGetRaiderRequest {
    raidTeamId: string;
    raiderId: string;
}

export interface RaidersControllerGetRaidersRequest {
    raidTeamId: string;
}

export interface RaidersControllerRemoveRaiderFromTeamRequest {
    raidTeamId: string;
    raiderId: string;
}

/**
 * 
 */
export class RaidersApi extends runtime.BaseAPI {

    /**
     * Add a raider to an existing raid team.
     */
    async raidersControllerAddRaiderToRaidTeamRaw(requestParameters: RaidersControllerAddRaiderToRaidTeamRequest): Promise<runtime.ApiResponse<Raider>> {
        if (requestParameters.raidTeamId === null || requestParameters.raidTeamId === undefined) {
            throw new runtime.RequiredError('raidTeamId','Required parameter requestParameters.raidTeamId was null or undefined when calling raidersControllerAddRaiderToRaidTeam.');
        }

        if (requestParameters.createRaiderDto === null || requestParameters.createRaiderDto === undefined) {
            throw new runtime.RequiredError('createRaiderDto','Required parameter requestParameters.createRaiderDto was null or undefined when calling raidersControllerAddRaiderToRaidTeam.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/raid-teams/{raidTeamId}/raiders`.replace(`{${"raidTeamId"}}`, encodeURIComponent(String(requestParameters.raidTeamId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateRaiderDtoToJSON(requestParameters.createRaiderDto),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => RaiderFromJSON(jsonValue));
    }

    /**
     * Add a raider to an existing raid team.
     */
    async raidersControllerAddRaiderToRaidTeam(requestParameters: RaidersControllerAddRaiderToRaidTeamRequest): Promise<Raider> {
        const response = await this.raidersControllerAddRaiderToRaidTeamRaw(requestParameters);
        return await response.value();
    }

    /**
     * Get a detailed view of a raider\'s character.
     */
    async raidersControllerGetDetailsRaw(requestParameters: RaidersControllerGetDetailsRequest): Promise<runtime.ApiResponse<object>> {
        if (requestParameters.raidTeamId === null || requestParameters.raidTeamId === undefined) {
            throw new runtime.RequiredError('raidTeamId','Required parameter requestParameters.raidTeamId was null or undefined when calling raidersControllerGetDetails.');
        }

        if (requestParameters.raiderId === null || requestParameters.raiderId === undefined) {
            throw new runtime.RequiredError('raiderId','Required parameter requestParameters.raiderId was null or undefined when calling raidersControllerGetDetails.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/raid-teams/{raidTeamId}/raiders/{raiderId}/details`.replace(`{${"raidTeamId"}}`, encodeURIComponent(String(requestParameters.raidTeamId))).replace(`{${"raiderId"}}`, encodeURIComponent(String(requestParameters.raiderId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Get a detailed view of a raider\'s character.
     */
    async raidersControllerGetDetails(requestParameters: RaidersControllerGetDetailsRequest): Promise<object> {
        const response = await this.raidersControllerGetDetailsRaw(requestParameters);
        return await response.value();
    }

    /**
     * Get an overview of a raider\'s character.
     */
    async raidersControllerGetOverviewRaw(requestParameters: RaidersControllerGetOverviewRequest): Promise<runtime.ApiResponse<RaiderOverviewDto>> {
        if (requestParameters.raidTeamId === null || requestParameters.raidTeamId === undefined) {
            throw new runtime.RequiredError('raidTeamId','Required parameter requestParameters.raidTeamId was null or undefined when calling raidersControllerGetOverview.');
        }

        if (requestParameters.raiderId === null || requestParameters.raiderId === undefined) {
            throw new runtime.RequiredError('raiderId','Required parameter requestParameters.raiderId was null or undefined when calling raidersControllerGetOverview.');
        }

        if (requestParameters.caching === null || requestParameters.caching === undefined) {
            throw new runtime.RequiredError('caching','Required parameter requestParameters.caching was null or undefined when calling raidersControllerGetOverview.');
        }

        const queryParameters: any = {};

        if (requestParameters.caching !== undefined) {
            queryParameters['caching'] = requestParameters.caching;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/raid-teams/{raidTeamId}/raiders/{raiderId}/overview`.replace(`{${"raidTeamId"}}`, encodeURIComponent(String(requestParameters.raidTeamId))).replace(`{${"raiderId"}}`, encodeURIComponent(String(requestParameters.raiderId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => RaiderOverviewDtoFromJSON(jsonValue));
    }

    /**
     * Get an overview of a raider\'s character.
     */
    async raidersControllerGetOverview(requestParameters: RaidersControllerGetOverviewRequest): Promise<RaiderOverviewDto> {
        const response = await this.raidersControllerGetOverviewRaw(requestParameters);
        return await response.value();
    }

    /**
     * Get a specific raider of an existing raid team.
     */
    async raidersControllerGetRaiderRaw(requestParameters: RaidersControllerGetRaiderRequest): Promise<runtime.ApiResponse<Array<Raider>>> {
        if (requestParameters.raidTeamId === null || requestParameters.raidTeamId === undefined) {
            throw new runtime.RequiredError('raidTeamId','Required parameter requestParameters.raidTeamId was null or undefined when calling raidersControllerGetRaider.');
        }

        if (requestParameters.raiderId === null || requestParameters.raiderId === undefined) {
            throw new runtime.RequiredError('raiderId','Required parameter requestParameters.raiderId was null or undefined when calling raidersControllerGetRaider.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/raid-teams/{raidTeamId}/raiders/{raiderId}`.replace(`{${"raidTeamId"}}`, encodeURIComponent(String(requestParameters.raidTeamId))).replace(`{${"raiderId"}}`, encodeURIComponent(String(requestParameters.raiderId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(RaiderFromJSON));
    }

    /**
     * Get a specific raider of an existing raid team.
     */
    async raidersControllerGetRaider(requestParameters: RaidersControllerGetRaiderRequest): Promise<Array<Raider>> {
        const response = await this.raidersControllerGetRaiderRaw(requestParameters);
        return await response.value();
    }

    /**
     * Get all raiders of an existing raid team.
     */
    async raidersControllerGetRaidersRaw(requestParameters: RaidersControllerGetRaidersRequest): Promise<runtime.ApiResponse<Array<Raider>>> {
        if (requestParameters.raidTeamId === null || requestParameters.raidTeamId === undefined) {
            throw new runtime.RequiredError('raidTeamId','Required parameter requestParameters.raidTeamId was null or undefined when calling raidersControllerGetRaiders.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/raid-teams/{raidTeamId}/raiders`.replace(`{${"raidTeamId"}}`, encodeURIComponent(String(requestParameters.raidTeamId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(RaiderFromJSON));
    }

    /**
     * Get all raiders of an existing raid team.
     */
    async raidersControllerGetRaiders(requestParameters: RaidersControllerGetRaidersRequest): Promise<Array<Raider>> {
        const response = await this.raidersControllerGetRaidersRaw(requestParameters);
        return await response.value();
    }

    /**
     * Remove a raider from an existing raid team.
     */
    async raidersControllerRemoveRaiderFromTeamRaw(requestParameters: RaidersControllerRemoveRaiderFromTeamRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.raidTeamId === null || requestParameters.raidTeamId === undefined) {
            throw new runtime.RequiredError('raidTeamId','Required parameter requestParameters.raidTeamId was null or undefined when calling raidersControllerRemoveRaiderFromTeam.');
        }

        if (requestParameters.raiderId === null || requestParameters.raiderId === undefined) {
            throw new runtime.RequiredError('raiderId','Required parameter requestParameters.raiderId was null or undefined when calling raidersControllerRemoveRaiderFromTeam.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/raid-teams/{raidTeamId}/raiders/{raiderId}`.replace(`{${"raidTeamId"}}`, encodeURIComponent(String(requestParameters.raidTeamId))).replace(`{${"raiderId"}}`, encodeURIComponent(String(requestParameters.raiderId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Remove a raider from an existing raid team.
     */
    async raidersControllerRemoveRaiderFromTeam(requestParameters: RaidersControllerRemoveRaiderFromTeamRequest): Promise<void> {
        await this.raidersControllerRemoveRaiderFromTeamRaw(requestParameters);
    }

}
