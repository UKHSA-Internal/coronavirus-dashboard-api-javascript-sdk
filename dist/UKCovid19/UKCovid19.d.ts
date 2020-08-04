export declare type FiltersType = Array<string>;
export interface StructureType {
    [key: string]: string;
}
export interface OptionsType {
    [key: string]: any;
}
export interface HeadType extends StructureType {
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
declare class Cov19API {
    static readonly endpoint: string;
    private readonly structure;
    private readonly filters;
    private readonly latestBy;
    private _lastUpdate;
    constructor({ filters, structure, latestBy }: UKCovid19Props);
    get apiParams(): APIParams;
    private getData;
    getJSON: () => Promise<JSONResponse>;
    head: () => Promise<HeadType>;
    lastUpdate: () => Promise<string>;
    static options: () => Promise<OptionsType>;
    getCSV: () => Promise<string>;
    get_json: () => Promise<JSONResponse>;
    get_csv: () => Promise<string>;
}
export default Cov19API;
//# sourceMappingURL=UKCovid19.d.ts.map