/**
 * Coronavirus (COVID-19) Dashboard - API Service
 * ==============================================
 *
 * Software Development Kit (SDK) for JavaScript
 * ---------------------------------------------
 *
 * This is a Python SDK for the COVID-19 API, as published by
 * Public Health England on `Coronavirus (COVID-19) in the UK`_
 * dashboard.
 *
 * The endpoint for the data provided using this SDK is:
 *
 *     https://api.coronavirus.data.gov.uk/v1/data
 *
 * .. _`Coronavirus (COVID-19) in the UK`: http://coronavirus.data.gov.uk/
 */

import axios from 'axios';
import moment from 'moment';

export type FiltersType = string[];

export interface StructureType {
    [key: string]: string;
}

export interface HeadType {
    [key: string]: string;
}

export interface OptionsType {
    [key: string]: any;
}

export interface UKCovid19Props {
    filters: FiltersType;
    structure: StructureType;
    latestBy?: string;
}

export interface APIParams {
    filters: string;
    structure: string;
    latestBy?: string;
}

export interface APIJSONResponse {
    data: StructureType[];
}

export interface JSONResponse {
    data: StructureType[];
    length: number;
    lastUpdate: string;
    totalPages: number;
}

/**
 *  COVID-19 API
 *  ------------
 *  Interface to access the API service for COVID-19 data in the United Kingdom.
 */
class Cov19API {
    static readonly endpoint: string =
        'https://api.coronavirus.data.gov.uk/v1/data';
    private readonly structure: StructureType;
    private readonly filters: string[];
    private readonly latestBy: string | undefined;
    private _lastUpdate: string | undefined;

    /**
     *
     * @param filters { FiltersType }  API filters. See the API documentations for
     *                                 additional information.
     *
     * @param structure { StructureType } Structure parameter. See the API
     *                                    documentations for additional information.
     *
     * @param latestBy { latestBy } Retrieves the latest value for a specific
     *                              metric. [Default: ``undefined``]
     *
     * @see https://coronavirus.data.gov.uk//developers-guide
     */
    constructor({ filters, structure, latestBy }: UKCovid19Props) {
        this.filters = filters;
        this.structure = structure;
        this.latestBy = latestBy;
    } // constructor

    /**
     * API parameters, constructed based on ``filters``, ``structure``,
     * and ``latest_by`` arguments as defined by the user.
     *
     * @returns { APIParams }
     */
    get apiParams(): APIParams {
        return {
            filters: this.filters.join(';'),
            structure: JSON.stringify(this.structure),
            ...(this.latestBy ? { latestBy: this.latestBy } : {}),
        };
    } // apiParams

    /**
     * Extracts paginated data by requesting all of the pages
     * and combining the results.
     *
     * @param format { string }
     *
     * @returns { Promise<APIJSONResponse[] | string[]> }
     */
    private getData = async (
        format: string,
    ): Promise<APIJSONResponse[] | string[]> => {
        const result = [];

        let currentPage = 1;

        while (true) {
            const { data, status, statusText, headers } = await axios.get(
                Cov19API.endpoint,
                {
                    params: { ...this.apiParams, page: currentPage, format },
                    timeout: 10000,
                },
            );

            if (status === 204) break;
            if (status >= 400) throw new Error(statusText);

            this._lastUpdate = headers['last-modified'];

            result.push(data);

            // break loop if records fit into current page
            if (data.length === data.totalRecords) break;

            currentPage++;
        }

        return result;
    }; // getData

    /**
     * Provides full data (all pages) in JSON.
     *
     * @returns { Promise<JSONResponse> }
     */
    getJSON = async (): Promise<JSONResponse> => {
        const data = (await this.getData('json')) as APIJSONResponse[];

        const responseData = data.reduce(
                (acc, item) => [...acc, ...(item?.data ?? [])],
                [] as StructureType[],
            );

        return {
            data: responseData,
            length: responseData.length,
            totalPages: data.length,
            lastUpdate: await this.lastUpdate(),
        };
    }; // getJSON

    /**
     * Request header for the given input arguments (``filters``,
     * ``structure``, and ``lastest_by``).
     *
     * @returns { Promise<HeadType> }
     */
    head = async (): Promise<HeadType> => {
        const { headers, status, statusText } = await axios.head(
            Cov19API.endpoint,
            {
                params: this.apiParams,
                timeout: 10000,
                responseType: 'text',
                method: 'HEAD',
            },
        );

        if (status >= 400) throw new Error(statusText);

        return headers;
    }; // head

    /**
     * Produces the timestamp for the last update in GMT.
     *
     * @returns { Promise<string> }
     */
    lastUpdate = async (): Promise<string> => {
        const head = await this.head();
        const lastModified = head['last-modified'];

        if (this._lastUpdate && this._lastUpdate.indexOf('Z') > -1)
            return this._lastUpdate;

        // Original format: Mon, 03 Aug 2020 14:46:40 GMT
        this._lastUpdate = moment(
            lastModified.replace(/\s+GMT$/i, ' Z'),
            'ddd, DD MMM YYYY HH:mm:ss Z',
        ).toISOString();

        return this._lastUpdate;
    }; // lastUpdate

    /**
     * Provides the options by calling the ``OPTIONS`` method of the API.
     *
     * @returns { Promise<OptionsType> }
     */
    static options = async (): Promise<OptionsType> => {
        const {
            data,
            status,
            statusText,
        } = await axios.options(Cov19API.endpoint, { timeout: 10000 });

        if (status >= 400) throw new Error(statusText);

        return data;
    }; // options

    /**
     * Provides full data (all pages) in CSV.
     *
     * .. warning::
     *      Please make sure that the ``structure`` is not hierarchical as
     *      CSV outputs are defined as 2D tables and as such, do not support
     *      hierarchies.
     *
     * @returns { Promise<string> }
     */
    getCSV = async (): Promise<string> => {
        const data = (await this.getData('csv')) as string[];

        return (
            data.reduce(
                (acc: string, item: string, index: number) =>
                    acc +
                    (index === 0
                        ? item.trim()
                        : item.trim().split('\n').slice(1).join('\n')),
                '',
            ) + '\n'
        );
    }; // getCSV

} // Cov19API

export default Cov19API;
