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
    Collaborator,
    CollaboratorFromJSON,
    CollaboratorToJSON,
    CollaboratorDto,
    CollaboratorDtoFromJSON,
    CollaboratorDtoToJSON,
    CreateRaidTeamDto,
    CreateRaidTeamDtoFromJSON,
    CreateRaidTeamDtoToJSON,
    RaidTeam,
    RaidTeamFromJSON,
    RaidTeamToJSON,
    RenameRaidTeamDto,
    RenameRaidTeamDtoFromJSON,
    RenameRaidTeamDtoToJSON,
} from '../models';

export interface RaidTeamsControllerCreateRequest {
    createRaidTeamDto: CreateRaidTeamDto;
}

export interface RaidTeamsControllerDeleteCollaboratorRequest {
    id: string;
    battletag: string;
}

export interface RaidTeamsControllerGetCollaboratorsRequest {
    id: string;
}

export interface RaidTeamsControllerGetOneRequest {
    id: string;
}

export interface RaidTeamsControllerPutCollaboratorRequest {
    id: string;
    battletag: string;
    collaboratorDto: CollaboratorDto;
}

export interface RaidTeamsControllerRemoveRequest {
    id: string;
}

export interface RaidTeamsControllerRenameTeamRequest {
    id: string;
    renameRaidTeamDto: RenameRaidTeamDto;
}

/**
 * 
 */
export class RaidTeamsApi extends runtime.BaseAPI {

    /**
     * Create a new raid team.
     */
    async raidTeamsControllerCreateRaw(requestParameters: RaidTeamsControllerCreateRequest): Promise<runtime.ApiResponse<RaidTeam>> {
        if (requestParameters.createRaidTeamDto === null || requestParameters.createRaidTeamDto === undefined) {
            throw new runtime.RequiredError('createRaidTeamDto','Required parameter requestParameters.createRaidTeamDto was null or undefined when calling raidTeamsControllerCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/raid-teams`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateRaidTeamDtoToJSON(requestParameters.createRaidTeamDto),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => RaidTeamFromJSON(jsonValue));
    }

    /**
     * Create a new raid team.
     */
    async raidTeamsControllerCreate(requestParameters: RaidTeamsControllerCreateRequest): Promise<RaidTeam> {
        const response = await this.raidTeamsControllerCreateRaw(requestParameters);
        return await response.value();
    }

    /**
     * Delete a raid team\'s collaborator. Owner of the raid team only.
     */
    async raidTeamsControllerDeleteCollaboratorRaw(requestParameters: RaidTeamsControllerDeleteCollaboratorRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling raidTeamsControllerDeleteCollaborator.');
        }

        if (requestParameters.battletag === null || requestParameters.battletag === undefined) {
            throw new runtime.RequiredError('battletag','Required parameter requestParameters.battletag was null or undefined when calling raidTeamsControllerDeleteCollaborator.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/raid-teams/{id}/collaborators/{battletag}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))).replace(`{${"battletag"}}`, encodeURIComponent(String(requestParameters.battletag))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete a raid team\'s collaborator. Owner of the raid team only.
     */
    async raidTeamsControllerDeleteCollaborator(requestParameters: RaidTeamsControllerDeleteCollaboratorRequest): Promise<void> {
        await this.raidTeamsControllerDeleteCollaboratorRaw(requestParameters);
    }

    /**
     * Get all existing raid teams.
     */
    async raidTeamsControllerGetAllRaw(): Promise<runtime.ApiResponse<Array<RaidTeam>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/raid-teams`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(RaidTeamFromJSON));
    }

    /**
     * Get all existing raid teams.
     */
    async raidTeamsControllerGetAll(): Promise<Array<RaidTeam>> {
        const response = await this.raidTeamsControllerGetAllRaw();
        return await response.value();
    }

    /**
     * Get a raid team\'s collaborators. Owner of the raid team only.
     */
    async raidTeamsControllerGetCollaboratorsRaw(requestParameters: RaidTeamsControllerGetCollaboratorsRequest): Promise<runtime.ApiResponse<Array<Collaborator>>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling raidTeamsControllerGetCollaborators.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/raid-teams/{id}/collaborators`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(CollaboratorFromJSON));
    }

    /**
     * Get a raid team\'s collaborators. Owner of the raid team only.
     */
    async raidTeamsControllerGetCollaborators(requestParameters: RaidTeamsControllerGetCollaboratorsRequest): Promise<Array<Collaborator>> {
        const response = await this.raidTeamsControllerGetCollaboratorsRaw(requestParameters);
        return await response.value();
    }

    /**
     * Get a specific raid team.
     */
    async raidTeamsControllerGetOneRaw(requestParameters: RaidTeamsControllerGetOneRequest): Promise<runtime.ApiResponse<RaidTeam>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling raidTeamsControllerGetOne.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/raid-teams/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => RaidTeamFromJSON(jsonValue));
    }

    /**
     * Get a specific raid team.
     */
    async raidTeamsControllerGetOne(requestParameters: RaidTeamsControllerGetOneRequest): Promise<RaidTeam> {
        const response = await this.raidTeamsControllerGetOneRaw(requestParameters);
        return await response.value();
    }

    /**
     * Add or update a raid team\'s collaborator. Owner of the raid team only.
     */
    async raidTeamsControllerPutCollaboratorRaw(requestParameters: RaidTeamsControllerPutCollaboratorRequest): Promise<runtime.ApiResponse<Collaborator>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling raidTeamsControllerPutCollaborator.');
        }

        if (requestParameters.battletag === null || requestParameters.battletag === undefined) {
            throw new runtime.RequiredError('battletag','Required parameter requestParameters.battletag was null or undefined when calling raidTeamsControllerPutCollaborator.');
        }

        if (requestParameters.collaboratorDto === null || requestParameters.collaboratorDto === undefined) {
            throw new runtime.RequiredError('collaboratorDto','Required parameter requestParameters.collaboratorDto was null or undefined when calling raidTeamsControllerPutCollaborator.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/raid-teams/{id}/collaborators/{battletag}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))).replace(`{${"battletag"}}`, encodeURIComponent(String(requestParameters.battletag))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: CollaboratorDtoToJSON(requestParameters.collaboratorDto),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => CollaboratorFromJSON(jsonValue));
    }

    /**
     * Add or update a raid team\'s collaborator. Owner of the raid team only.
     */
    async raidTeamsControllerPutCollaborator(requestParameters: RaidTeamsControllerPutCollaboratorRequest): Promise<Collaborator> {
        const response = await this.raidTeamsControllerPutCollaboratorRaw(requestParameters);
        return await response.value();
    }

    /**
     * Delete a raid team.
     */
    async raidTeamsControllerRemoveRaw(requestParameters: RaidTeamsControllerRemoveRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling raidTeamsControllerRemove.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/raid-teams/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete a raid team.
     */
    async raidTeamsControllerRemove(requestParameters: RaidTeamsControllerRemoveRequest): Promise<void> {
        await this.raidTeamsControllerRemoveRaw(requestParameters);
    }

    /**
     * Rename an existing raid team.
     */
    async raidTeamsControllerRenameTeamRaw(requestParameters: RaidTeamsControllerRenameTeamRequest): Promise<runtime.ApiResponse<RaidTeam>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling raidTeamsControllerRenameTeam.');
        }

        if (requestParameters.renameRaidTeamDto === null || requestParameters.renameRaidTeamDto === undefined) {
            throw new runtime.RequiredError('renameRaidTeamDto','Required parameter requestParameters.renameRaidTeamDto was null or undefined when calling raidTeamsControllerRenameTeam.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/raid-teams/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: RenameRaidTeamDtoToJSON(requestParameters.renameRaidTeamDto),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => RaidTeamFromJSON(jsonValue));
    }

    /**
     * Rename an existing raid team.
     */
    async raidTeamsControllerRenameTeam(requestParameters: RaidTeamsControllerRenameTeamRequest): Promise<RaidTeam> {
        const response = await this.raidTeamsControllerRenameTeamRaw(requestParameters);
        return await response.value();
    }

}
