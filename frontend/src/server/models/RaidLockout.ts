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
    RaidDifficultyLockout,
    RaidDifficultyLockoutFromJSON,
    RaidDifficultyLockoutFromJSONTyped,
    RaidDifficultyLockoutToJSON,
} from './';

/**
 * 
 * @export
 * @interface RaidLockout
 */
export interface RaidLockout {
    /**
     * 
     * @type {string}
     * @memberof RaidLockout
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof RaidLockout
     */
    id: number;
    /**
     * 
     * @type {Array<RaidDifficultyLockout>}
     * @memberof RaidLockout
     */
    lockouts: Array<RaidDifficultyLockout>;
}

export function RaidLockoutFromJSON(json: any): RaidLockout {
    return RaidLockoutFromJSONTyped(json, false);
}

export function RaidLockoutFromJSONTyped(json: any, ignoreDiscriminator: boolean): RaidLockout {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'id': json['id'],
        'lockouts': ((json['lockouts'] as Array<any>).map(RaidDifficultyLockoutFromJSON)),
    };
}

export function RaidLockoutToJSON(value?: RaidLockout | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'id': value.id,
        'lockouts': ((value.lockouts as Array<any>).map(RaidDifficultyLockoutToJSON)),
    };
}


