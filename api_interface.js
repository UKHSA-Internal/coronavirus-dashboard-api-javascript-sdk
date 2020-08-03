
const axios = require('axios').default;


class Covid19API {
    endpoint = "https://api.coronavirus.data.gov.uk/v1/data"
    lastUpdate = null;
    result = [];


    constructor (filters, structure, latest_by) {
        this.filters = filters;
        this.structure = structure;
        this.latest_by = latest_by;
        

        this.apiParams = {
            filters: filters.join(";"),
            structure: JSON.stringify(structure),
            latestBy: latest_by,
            
            
        };

    }

    
    
    getData = async (reqtype) => {
        if (reqtype === "json"){
            let
                nextPage = null,
                currentPage = 1;

            do {
                const { data, headers, status, statusText } = await axios.get(this.endpoint, {
                    params: {
                        ...this.apiParams,
                        page: currentPage
                    },
                    timeout: 10000
                });
            
                if (status >= 400)
                    throw new Error(statusText);
                
                if ("pagination" in data)
                    nextPage = data.pagination.next || null;

                if(this.lastUpdate == null)
                    this.lastUpdate = headers["last-modified"];

                this.result.push(...data.data);

                currentPage++;
            } while (nextPage);
            
            
            return this.result
        }
    };
    
    getJSON = () => this.getData("json");
    
    getCSV = () => {
        this.apiParams = {...this.apiParams, format: "csv"};
        return this.getData();
    };
    
    getXML = () => {
        this.apiParams = {...this.apiParams, format: "xml"};
        return this.getData();
    };


    getLastUpdate = () => this.lastUpdate
    
    
    
}

const areaType = "nation";

const 
    filters = [
        `areaType=${areaType}`
    ],
    
    structure = {
        name: "areaName",
        cumulativeCases: "cumCasesByPublishDate",
        hospitalCases: "hospitalCases",
        
        
    },
    latestBy = "cumCasesByPublishDate"

    




    

data = new Covid19API(filters, structure, latestBy);

(async () => {
    var jsonData = await data.getJSON();
    console.log(JSON.stringify(jsonData));
    var lastUpdate = await data.getLastUpdate();
    console.log(lastUpdate);
    })()


