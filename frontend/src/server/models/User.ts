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
 * @interface User
 */
export interface User {
    /**
     * 
     * @type {string}
     * @memberof User
     */
    battletag: string;
    /**
     * 
     * @type {number}
     * @memberof User
     */
    id: number;
    /**
     * 
     * @type {Date}
     * @memberof User
     */
    createdAt: Date;
    /**
     * 
     * @type {Date}
     * @memberof User
     */
    updatedAt: Date;
}

export function UserFromJSON(json: any): User {
    return UserFromJSONTyped(json, false);
}

export function UserFromJSONTyped(json: any, ignoreDiscriminator: boolean): User {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'battletag': json['battletag'],
        'id': json['id'],
        'createdAt': (new Date(json['createdAt'])),
        'updatedAt': (new Date(json['updatedAt'])),
    };
}

export function UserToJSON(value?: User | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'battletag': value.battletag,
        'id': value.id,
        'createdAt': (value.createdAt.toISOString()),
        'updatedAt': (value.updatedAt.toISOString()),
    };
}


