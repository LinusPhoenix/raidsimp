/* tslint:disable */
/* eslint-disable */
/**
 * WoW Raid Manager OpenAPI Spec
 * Manage your raid teams, enhanced with data from the Blizzard API.
 *
 * The version of the OpenAPI document: 0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface SearchResultDto
 */
export interface SearchResultDto {
    /**
     * 
     * @type {string}
     * @memberof SearchResultDto
     */
    characterName: string;
    /**
     * 
     * @type {string}
     * @memberof SearchResultDto
     */
    realmName: string;
}

export function SearchResultDtoFromJSON(json: any): SearchResultDto {
    return SearchResultDtoFromJSONTyped(json, false);
}

export function SearchResultDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): SearchResultDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'characterName': json['characterName'],
        'realmName': json['realmName'],
    };
}

export function SearchResultDtoToJSON(value?: SearchResultDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'characterName': value.characterName,
        'realmName': value.realmName,
    };
}


