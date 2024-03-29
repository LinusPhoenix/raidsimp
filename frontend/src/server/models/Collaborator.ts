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
/**
 * 
 * @export
 * @interface Collaborator
 */
export interface Collaborator {
    /**
     * 
     * @type {string}
     * @memberof Collaborator
     */
    battletag: string;
    /**
     * 
     * @type {string}
     * @memberof Collaborator
     */
    displayName: string;
    /**
     * 
     * @type {string}
     * @memberof Collaborator
     */
    role: CollaboratorRoleEnum;
    /**
     * 
     * @type {Date}
     * @memberof Collaborator
     */
    createdAt: Date;
    /**
     * 
     * @type {Date}
     * @memberof Collaborator
     */
    updatedAt: Date;
}

/**
* @export
* @enum {string}
*/
export enum CollaboratorRoleEnum {
    Editor = 'editor',
    Viewer = 'viewer'
}

export function CollaboratorFromJSON(json: any): Collaborator {
    return CollaboratorFromJSONTyped(json, false);
}

export function CollaboratorFromJSONTyped(json: any, ignoreDiscriminator: boolean): Collaborator {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'battletag': json['battletag'],
        'displayName': json['displayName'],
        'role': json['role'],
        'createdAt': (new Date(json['createdAt'])),
        'updatedAt': (new Date(json['updatedAt'])),
    };
}

export function CollaboratorToJSON(value?: Collaborator | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'battletag': value.battletag,
        'displayName': value.displayName,
        'role': value.role,
        'createdAt': (value.createdAt.toISOString()),
        'updatedAt': (value.updatedAt.toISOString()),
    };
}


