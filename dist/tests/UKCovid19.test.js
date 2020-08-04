"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var assert_1 = __importDefault(require("assert"));
var UKCovid19_1 = __importDefault(require("../UKCovid19"));
var queryFilters = [
    'areaType=ltla',
    'areaName=adur'
], queryStructure = {
    "name": "areaName",
    "date": "date",
    "newCases": "newCasesBySpecimenDate"
};
mocha_1.describe("Cov19API", function () {
    var api = new UKCovid19_1.default({ filters: queryFilters, structure: queryStructure });
    mocha_1.describe('#apiParams', function () {
        mocha_1.it('apiParams integrity', function () {
            var apiParams = {
                "filters": queryFilters.join(";"),
                "structure": JSON.stringify(queryStructure),
            };
            assert_1.default.deepEqual(api.apiParams, apiParams);
        });
    });
    mocha_1.describe('#lastUpdate', function () {
        mocha_1.it('lastUpdate integrity', function () { return __awaiter(void 0, void 0, void 0, function () {
            var timestamp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, api.lastUpdate()];
                    case 1:
                        timestamp = _a.sent();
                        assert_1.default.strictEqual(timestamp.indexOf("Z") > -1, true, timestamp);
                        return [2];
                }
            });
        }); });
    });
    mocha_1.describe('#head', function () {
        mocha_1.it('head', function () { return __awaiter(void 0, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, api.head()];
                    case 1:
                        data = _a.sent();
                        assert_1.default.strictEqual("content-location" in data, true);
                        return [2];
                }
            });
        }); });
    });
    mocha_1.describe('#getJSON', function () {
        mocha_1.it('JSON integrity', function () { return __awaiter(void 0, void 0, void 0, function () {
            var jsonData, lastUpdate, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, api.getJSON()];
                    case 1:
                        jsonData = _a.sent();
                        assert_1.default.strictEqual(typeof jsonData, "object");
                        assert_1.default.strictEqual("data" in jsonData, true);
                        assert_1.default.strictEqual("lastUpdate" in jsonData, true);
                        assert_1.default.strictEqual("length" in jsonData, true);
                        assert_1.default.strictEqual("totalPages" in jsonData, true);
                        return [4, api.lastUpdate()];
                    case 2:
                        lastUpdate = _a.sent();
                        assert_1.default.strictEqual(jsonData.lastUpdate, lastUpdate, jsonData.lastUpdate + " !== " + lastUpdate);
                        assert_1.default.equal(jsonData.totalPages, 1);
                        assert_1.default.strictEqual(jsonData.data.length > 10, true);
                        for (key in queryStructure) {
                            if (!queryStructure.hasOwnProperty(key))
                                continue;
                            assert_1.default.strictEqual(key in jsonData.data[0], true, key + " not found.");
                        }
                        return [2];
                }
            });
        }); });
    });
    mocha_1.describe('#getCSV', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            mocha_1.it('CSV integrity', function () { return __awaiter(void 0, void 0, void 0, function () {
                var csvData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, api.getCSV()];
                        case 1:
                            csvData = _a.sent();
                            assert_1.default.strictEqual(typeof csvData, "string");
                            assert_1.default.strictEqual(csvData.split("\n").length > 10, true);
                            assert_1.default.strictEqual(csvData
                                .split("\n")[0]
                                .trim(), Object.keys(queryStructure)
                                .join(","));
                            return [2];
                    }
                });
            }); });
            return [2];
        });
    }); });
    mocha_1.describe('#latestBy', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            mocha_1.it('latestBy integrity', function () { return __awaiter(void 0, void 0, void 0, function () {
                var api, jsonLatestData, _a, _b, _c, key;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            api = new UKCovid19_1.default({
                                filters: queryFilters,
                                structure: queryStructure,
                                latestBy: "newCasesBySpecimenDate"
                            });
                            return [4, api.getJSON()];
                        case 1:
                            jsonLatestData = _d.sent();
                            assert_1.default.strictEqual(typeof jsonLatestData, "object");
                            assert_1.default.strictEqual("data" in jsonLatestData, true);
                            assert_1.default.strictEqual("lastUpdate" in jsonLatestData, true);
                            assert_1.default.strictEqual("length" in jsonLatestData, true);
                            assert_1.default.strictEqual("totalPages" in jsonLatestData, true);
                            _b = (_a = assert_1.default).strictEqual;
                            _c = [jsonLatestData.lastUpdate];
                            return [4, api.lastUpdate()];
                        case 2:
                            _b.apply(_a, _c.concat([_d.sent()]));
                            assert_1.default.equal(jsonLatestData.totalPages, 1);
                            assert_1.default.equal(jsonLatestData.data.length, 1);
                            for (key in queryStructure) {
                                if (!queryStructure.hasOwnProperty(key))
                                    continue;
                                assert_1.default.strictEqual(key in jsonLatestData.data[0], true, key + " not found.");
                            }
                            return [2];
                    }
                });
            }); });
            mocha_1.it('response lengths are equal', function () { return __awaiter(void 0, void 0, void 0, function () {
                var csvData, jsonData, csvHeaderLength;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, api.getCSV()];
                        case 1:
                            csvData = _a.sent();
                            return [4, api.getJSON()];
                        case 2:
                            jsonData = _a.sent(), csvHeaderLength = 1;
                            assert_1.default.equal(jsonData.data.length, csvData
                                .trim()
                                .split("\n")
                                .slice(csvHeaderLength)
                                .length);
                            return [2];
                    }
                });
            }); });
            return [2];
        });
    }); });
    mocha_1.describe('#options', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            mocha_1.it('options integrity', function () { return __awaiter(void 0, void 0, void 0, function () {
                var options;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, UKCovid19_1.default.options()];
                        case 1:
                            options = _a.sent();
                            assert_1.default.strictEqual("servers" in options, true);
                            assert_1.default.strictEqual(options.servers[0].url, UKCovid19_1.default.endpoint);
                            return [2];
                    }
                });
            }); });
            return [2];
        });
    }); });
});
//# sourceMappingURL=UKCovid19.test.js.map