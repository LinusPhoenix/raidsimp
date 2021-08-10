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
import {
    RaidLockout,
    RaidLockoutFromJSON,
    RaidLockoutFromJSONTyped,
    RaidLockoutToJSON,
} from './';

/**
 * 
 * @export
 * @interface RaiderOverviewDto
 */
export interface RaiderOverviewDto {
    /**
     * 
     * @type {string}
     * @memberof RaiderOverviewDto
     */
    avatarUrl: string;
    /**
     * 
     * @type {string}
     * @memberof RaiderOverviewDto
     */
    characterName: string;
    /**
     * 
     * @type {string}
     * @memberof RaiderOverviewDto
     */
    realm: string;
    /**
     * 
     * @type {string}
     * @memberof RaiderOverviewDto
     */
    role: RaiderOverviewDtoRoleEnum;
    /**
     * 
     * @type {string}
     * @memberof RaiderOverviewDto
     */
    _class: string;
    /**
     * 
     * @type {string}
     * @memberof RaiderOverviewDto
     */
    spec: string;
    /**
     * 
     * @type {number}
     * @memberof RaiderOverviewDto
     */
    averageItemLevel: number;
    /**
     * 
     * @type {string}
     * @memberof RaiderOverviewDto
     */
    covenant?: string;
    /**
     * 
     * @type {number}
     * @memberof RaiderOverviewDto
     */
    renown?: number;
    /**
     * 
     * @type {RaidLockout}
     * @memberof RaiderOverviewDto
     */
    currentLockout?: RaidLockout;
}

/**
* @export
* @enum {string}
*/
export enum RaiderOverviewDtoRoleEnum {
    Tank = 'tank',
    Healer = 'healer',
    Melee = 'melee',
    Ranged = 'ranged'
}

export function RaiderOverviewDtoFromJSON(json: any): RaiderOverviewDto {
    return RaiderOverviewDtoFromJSONTyped(json, false);
}

export function RaiderOverviewDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): RaiderOverviewDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'avatarUrl': json['avatarUrl'],
        'characterName': json['characterName'],
        'realm': json['realm'],
        'role': json['role'],
        '_class': json['class'],
        'spec': json['spec'],
        'averageItemLevel': json['averageItemLevel'],
        'covenant': !exists(json, 'covenant') ? undefined : json['covenant'],
        'renown': !exists(json, 'renown') ? undefined : json['renown'],
        'currentLockout': !exists(json, 'currentLockout') ? undefined : RaidLockoutFromJSON(json['currentLockout']),
    };
}

export function RaiderOverviewDtoToJSON(value?: RaiderOverviewDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'avatarUrl': value.avatarUrl,
        'characterName': value.characterName,
        'realm': value.realm,
        'role': value.role,
        'class': value._class,
        'spec': value.spec,
        'averageItemLevel': value.averageItemLevel,
        'covenant': value.covenant,
        'renown': value.renown,
        'currentLockout': RaidLockoutToJSON(value.currentLockout),
    };
}


