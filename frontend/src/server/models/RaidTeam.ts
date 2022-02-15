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

import { exists, mapValues } from '../runtime';
import {
    Raider,
    RaiderFromJSON,
    RaiderFromJSONTyped,
    RaiderToJSON,
} from './';

/**
 * 
 * @export
 * @interface RaidTeam
 */
export interface RaidTeam {
    /**
     * 
     * @type {string}
     * @memberof RaidTeam
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof RaidTeam
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof RaidTeam
     */
    region: RaidTeamRegionEnum;
    /**
     * 
     * @type {Array<Raider>}
     * @memberof RaidTeam
     */
    raiders: Array<Raider>;
    /**
     * 
     * @type {Date}
     * @memberof RaidTeam
     */
    createdAt: Date;
    /**
     * 
     * @type {Date}
     * @memberof RaidTeam
     */
    updatedAt: Date;
}

/**
* @export
* @enum {string}
*/
export enum RaidTeamRegionEnum {
    Us = 'us',
    Eu = 'eu',
    Kr = 'kr',
    Tw = 'tw',
    Cn = 'cn'
}

export function RaidTeamFromJSON(json: any): RaidTeam {
    return RaidTeamFromJSONTyped(json, false);
}

export function RaidTeamFromJSONTyped(json: any, ignoreDiscriminator: boolean): RaidTeam {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
        'region': json['region'],
        'raiders': ((json['raiders'] as Array<any>).map(RaiderFromJSON)),
        'createdAt': (new Date(json['createdAt'])),
        'updatedAt': (new Date(json['updatedAt'])),
    };
}

export function RaidTeamToJSON(value?: RaidTeam | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
        'region': value.region,
        'raiders': ((value.raiders as Array<any>).map(RaiderToJSON)),
        'createdAt': (value.createdAt.toISOString()),
        'updatedAt': (value.updatedAt.toISOString()),
    };
}


