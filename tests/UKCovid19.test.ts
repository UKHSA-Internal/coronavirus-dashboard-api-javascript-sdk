import { describe, it } from "mocha";
import assert from "assert";

import Cov19API from "../UKCovid19";
import type { StructureType, FiltersType } from "../UKCovid19/UKCovid19";


const
    queryFilters: FiltersType = [
        'areaType=ltla',
        'areaName=adur'
    ],
    queryStructure: StructureType = {
        "name": "areaName",
        "date": "date",
        "newCases": "newCasesBySpecimenDate"
    };


describe("Cov19API", () => {
    
    const api = new Cov19API({filters: queryFilters, structure: queryStructure});
    
    describe('#apiParams', () => {
        
        it('apiParams integrity', () => {
            
            const apiParams = {
                "filters": queryFilters.join(";"),
                "structure": JSON.stringify(queryStructure),
            }
            
            assert.deepEqual(api.apiParams, apiParams);
        });
        
    });
    
    
    describe('#lastUpdate', () => {
        
        it('lastUpdate integrity', async () => {
            
            const timestamp = await api.lastUpdate();
            
            assert.strictEqual(timestamp.indexOf("Z") > -1, true, timestamp)
            
        });
        
    });
    
    
    describe('#head', () => {
        
        it('head', async () => {
            
            const data = await api.head();
            
            assert.strictEqual("content-location" in data, true);
            
        });
    });
    
    
    describe('#getJSON', () => {
    
        it('JSON integrity', async () => {
            const jsonData = await api.getJSON();
        
            assert.strictEqual(typeof jsonData, "object");
            assert.strictEqual("data" in jsonData, true);
            assert.strictEqual("lastUpdate" in jsonData, true);
            assert.strictEqual("length" in jsonData, true);
            assert.strictEqual("totalPages" in jsonData, true);
        
            const lastUpdate = await api.lastUpdate();
            assert.strictEqual(
                jsonData.lastUpdate,
                lastUpdate,
                `${jsonData.lastUpdate} !== ${lastUpdate}`
            );
            assert.equal(jsonData.totalPages, 1);
            assert.strictEqual(jsonData.data.length > 10, true);
        
            // Test keys
            for (const key in queryStructure) {
                if (!queryStructure.hasOwnProperty(key)) continue;
            
                assert.strictEqual(
                    key in jsonData.data[0],
                    true,
                    `${key} not found.`
                );
            }
            
        });
    
    });
    
    
    describe('#getCSV', async () => {
        
        it('CSV integrity', async () => {
        
            const csvData = await api.getCSV();
        
            assert.strictEqual(typeof csvData, "string");
            
            assert.strictEqual(
                csvData.split("\n").length > 10,
                true
            );
            
            assert.strictEqual(
                csvData
                    .split("\n")[0]
                    .trim(),
                Object.keys(queryStructure)
                    .join(","),
            );
            
        });
        
    });
    
    
    describe('#latestBy', async () => {
    
        it('latestBy integrity', async () => {
        
            const
                api = new Cov19API({
                    filters: queryFilters,
                    structure: queryStructure,
                    latestBy: "newCasesBySpecimenDate"
                }),
                jsonLatestData = await api.getJSON();
        
            assert.strictEqual(typeof jsonLatestData, "object");
        
            assert.strictEqual("data" in jsonLatestData, true);
            assert.strictEqual("lastUpdate" in jsonLatestData, true);
            assert.strictEqual("length" in jsonLatestData, true);
            assert.strictEqual("totalPages" in jsonLatestData, true);
        
            assert.strictEqual(jsonLatestData.lastUpdate, await api.lastUpdate());
            assert.equal(jsonLatestData.totalPages, 1);
            assert.equal(jsonLatestData.data.length, 1);
        
            for (const key in queryStructure) {
                if (!queryStructure.hasOwnProperty(key)) continue;
            
                assert.strictEqual(
                    key in jsonLatestData.data[0],
                    true,
                    `${key} not found.`
                );
            }
        
        });
    
        it('response lengths are equal', async () => {
            const
                csvData = await api.getCSV(),
                jsonData = await api.getJSON(),
                csvHeaderLength = 1;
        
            assert.equal(
                jsonData.data.length,
                csvData
                    .trim()
                    .split("\n")
                    .slice(csvHeaderLength)
                    .length
            )
        
        });
        
    });
    
    describe('#options', async () => {
        
        it('options integrity', async () => {
            const options = await Cov19API.options();

            assert.strictEqual("servers" in options, true);
            assert.strictEqual(options.servers[0].url, Cov19API.endpoint)
        });

    });
    
});
