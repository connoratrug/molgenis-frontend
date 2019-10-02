// tslint:disable
/**
 * MOLGENIS data & metadata API
 * RESTful API to create/read/update/delete data and metadata.
 *
 * The version of the OpenAPI document: 3.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * 
 * @export
 * @interface Problem
 */
export interface Problem {
    /**
     * An absolute URI that identifies the problem type.  When dereferenced, it SHOULD provide human-readable documentation for the problem type (e.g., using HTML).
     * @type {string}
     * @memberof Problem
     */
    type?: string;
    /**
     * A short, summary of the problem type. Written in english and readable for engineers (usually not suited for non technical stakeholders and not localized)
     * @type {string}
     * @memberof Problem
     */
    title?: string;
    /**
     * The HTTP status code generated by the origin server for this occurrence of the problem.
     * @type {number}
     * @memberof Problem
     */
    status?: number;
    /**
     * A human readable explanation specific to this occurrence of the problem.
     * @type {string}
     * @memberof Problem
     */
    detail?: string;
    /**
     * An absolute URI that identifies the specific occurrence of the problem. It may or may not yield further information if dereferenced. 
     * @type {string}
     * @memberof Problem
     */
    instance?: string;
    /**
     * The MOLGENIS error code for the thrown exception.
     * @type {string}
     * @memberof Problem
     */
    errorCode?: string;
}


