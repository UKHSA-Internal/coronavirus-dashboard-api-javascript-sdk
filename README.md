# Coronavirus (COVID-19) in the UK - API Service

![npm](https://img.shields.io/npm/v/@publichealthengland/uk-covid19)
![GitHub](https://img.shields.io/github/license/publichealthengland/coronavirus-dashboard-api-javascript-sdk)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/publichealthengland/coronavirus-dashboard-api-javascript-sdk.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/publichealthengland/coronavirus-dashboard-api-javascript-sdk/context:javascript)

## Software Development Kit (SDK) for JavaScript

This is a JavaScript SDK for the COVID-19 API, as published by Public Health England
on [Coronavirus (COVID-19) in the UK](http://coronavirus.data.gov.uk/).

The API supplies the latest data for the COVID-19 outbreak in the United Kingdom. 

The endpoint for the data provided using this SDK is:

    https://api.coronavirus.data.gov.uk/v1/data

The SDK is also available for [Python](https://github.com/publichealthengland/coronavirus-dashboard-api-python-sdk) 
and [R](https://github.com/publichealthengland/coronavirus-dashboard-api-R-sdk).


### Pagination

Using this SDK will bypass the pagination process. You will always download the entire
dataset unless the `latest_by` argument is defined.



### Installation


Python 3.7+ is required to install and use this library.

To install globally, please run:

```bash
npm install -g @publichealthengland/uk-covid19
```

or to install locally in your project, run:

```bash
npm install @publichealthengland/uk-covid19
```

Import the library in TypeScript as follows:

```typescript
import Cov19API from "@publichealthengland/uk-covid19";
```

or using CommonJS:

```javascript
const Cov19API = require("@publichealthengland/uk-covid19");
```


### Example

We would like to extract the number of new cases, cumulative cases, new deaths and
cumulative deaths for England using the API.

We start off by importing the library into our workspace:

```javascript
const Cov19API = require("@publichealthengland/uk-covid19");
```

Next, we construct the value of the `filters` parameter:

```javascript
const englandOnly = [
    'areaType=nation',
    'areaName=England'
];
```

Next step is to construct the value of the `structure` parameter. To do so, we need to
find out the name of the metric in which we are interested. You can find this information
in the Developer's Guide on the Coronavirus Dashboard website.

In the case of this example, the metrics are as follows:

- `newCasesByPublishDate`: New cases (by publish date)
- `cumCasesByPublishDate`: Cumulative cases (by publish date)
- `newDeathsByDeathDate`: New deaths (by death date)
- `cumDeathsByDeathDate`: Cumulative deaths (by death date)

In its simplest form, we construct the structure as follows:

```javascript
const casesAndDeaths = {
    "date": "date",
    "areaName": "areaName",
    "areaCode": "areaCode",
    "newCasesByPublishDate": "newCasesByPublishDate",
    "cumCasesByPublishDate": "cumCasesByPublishDate",
    "newDeathsByDeathDate": "newDeathsByDeathDate",
    "cumDeathsByDeathDate": "cumDeathsByDeathDate"
};
```

Now, we may use `filters` and `structure` to initialise the `Covid19API` object:

```javascript
const api = new Cov19API({
        filters: englandOnly,
        structure: casesAndDeaths
    });

const data = api.getJSON(); 

console.log(data)
```

You may also use `data.getCSV()` to download the data in CSV. This is exemplified later 
in this document.

```
{
    'data': [
        {
            'date': '2020-07-28',
            'areaName': 'England',
            'areaCode': 'E92000001',
            'newCasesByPublishDate': 547,
            'cumCasesByPublishDate': 259022,
            'newDeathsByDeathDate': None,
            'cumDeathsByDeathDate': None
        },
        {
            'date': '2020-07-27',
            'areaName': 'England',
            'areaCode': 'E92000001',
            'newCasesByPublishDate': 616,
            'cumCasesByPublishDate': 258475,
            'newDeathsByDeathDate': 20,
            'cumDeathsByDeathDate': 41282
        },
        ...
    ],
    'lastUpdate': '2020-07-28T15:34:31.000000Z',
    'length': 162,
    'totalPages': 1
}
```

To see the timestamp for the last update, run:

```javascript
const timestamp = api.lastUpdate();

console.log(timestamp);
```

```
2020-07-28T15:34:31.000Z
```

To get the latest data by a specific metric, run:

```javascript
const allNations = [
    "areaType=nation"
];

const latestData = new Cov19API({
        filters: allNations,
        structure: casesAndDeaths,
        latest_by: "newCasesByPublishDate"
    });

const data = latestData.getJSON();

console.log(data)
```

```
{
    "data": [
        {
            "date": "2020-07-28",
            "areaName": "England",
            "areaCode": "E92000001",
            "newCasesByPublishDate": 547,
            "cumCasesByPublishDate": 259022,
            "newDeathsByDeathDate": None,
            "cumDeathsByDeathDate": None
        },
        {
            "date": "2020-07-28",
            "areaName": "Northern Ireland",
            "areaCode": "N92000002",
            "newCasesByPublishDate": 9,
            "cumCasesByPublishDate": 5921,
            "newDeathsByDeathDate": None,
            "cumDeathsByDeathDate": None
        },
        {
            "date": "2020-07-28",
            "areaName": "Scotland",
            "areaCode": "S92000003",
            "newCasesByPublishDate": 4,
            "cumCasesByPublishDate": 18558,
            "newDeathsByDeathDate": None,
            "cumDeathsByDeathDate": None
        },
        {
            "date": "2020-07-28",
            "areaName": "Wales",
            "areaCode": "W92000004",
            "newCasesByPublishDate": 21,
            "cumCasesByPublishDate": 17191,
            "newDeathsByDeathDate": None,
            "cumDeathsByDeathDate": None
        }
    ],
    "lastUpdate": "2020-07-28T15:34:31.000000Z",
    "length": 4,
    "totalPages": 1
}
```


You may retrieve CSV-formatted data as follows:

```javascript
const csvData = api.getCSV();

console.log(csvData)
```

```
date,areaName,areaCode,newCasesByPublishDate,cumCasesByPublishDate,newDeathsByDeathDate,cumDeathsByDeathDate
2020-07-28,England,E92000001,547,259022,,
2020-07-28,Northern Ireland,N92000002,9,5921,,
2020-07-28,Scotland,S92000003,4,18558,,
2020-07-28,Wales,W92000004,21,17191,,
```

-----------

Developed and maintained by [Public Health England](https://www.gov.uk/government/organisations/public-health-england).

Copyright (c) 2020, Public Health England.
