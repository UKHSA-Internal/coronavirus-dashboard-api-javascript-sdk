"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var moment_1 = __importDefault(require("moment"));
var Cov19API = (function () {
    function Cov19API(_a) {
        var _this = this;
        var filters = _a.filters, structure = _a.structure, latestBy = _a.latestBy;
        this.getData = function (format) { return __awaiter(_this, void 0, void 0, function () {
            var result, currentPage, _a, data, status_1, statusText, headers;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = [];
                        currentPage = 1;
                        _b.label = 1;
                    case 1:
                        if (!true) return [3, 3];
                        return [4, axios_1.default.get(Cov19API.endpoint, {
                                params: __assign(__assign({}, this.apiParams), { page: currentPage, format: format }),
                                timeout: 10000
                            })];
                    case 2:
                        _a = _b.sent(), data = _a.data, status_1 = _a.status, statusText = _a.statusText, headers = _a.headers;
                        if (status_1 == 204)
                            return [3, 3];
                        if (status_1 >= 400)
                            throw new Error(statusText);
                        this._lastUpdate = headers['last-modified'];
                        result.push(data);
                        currentPage++;
                        return [3, 1];
                    case 3: return [2, result];
                }
            });
        }); };
        this.getJSON = function () { return __awaiter(_this, void 0, void 0, function () {
            var data, responseData, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this.getData("json")];
                    case 1:
                        data = _b.sent(), responseData = data.reduce(function (acc, item) {
                            var _a;
                            return __spread(acc, (_a = item === null || item === void 0 ? void 0 : item.data) !== null && _a !== void 0 ? _a : []);
                        }, []);
                        _a = {
                            data: responseData,
                            length: responseData.length,
                            totalPages: data.length
                        };
                        return [4, this.lastUpdate()];
                    case 2: return [2, (_a.lastUpdate = _b.sent(),
                            _a)];
                }
            });
        }); };
        this.head = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, headers, status, statusText;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, axios_1.default.head(Cov19API.endpoint, {
                            params: this.apiParams,
                            timeout: 10000,
                            responseType: "text",
                            method: "HEAD"
                        })];
                    case 1:
                        _a = _b.sent(), headers = _a.headers, status = _a.status, statusText = _a.statusText;
                        if (status >= 400)
                            throw new Error(statusText);
                        return [2, headers];
                }
            });
        }); };
        this.lastUpdate = function () { return __awaiter(_this, void 0, void 0, function () {
            var head, lastModified;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.head()];
                    case 1:
                        head = _a.sent(), lastModified = head['last-modified'];
                        if (this._lastUpdate && this._lastUpdate.indexOf("Z") > -1)
                            return [2, this._lastUpdate];
                        this._lastUpdate = moment_1.default(lastModified.replace(/\s+GMT$/i, " Z"), "ddd, DD MMM YYYY HH:mm:ss Z").toISOString();
                        return [2, this._lastUpdate];
                }
            });
        }); };
        this.getCSV = function () { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getData("csv")];
                    case 1:
                        data = _a.sent();
                        return [2, data.reduce(function (acc, item, index) {
                                return acc + (index === 0
                                    ? item.trim()
                                    : item
                                        .trim()
                                        .split("\n")
                                        .slice(1)
                                        .join("\n"));
                            }, "") + "\n"];
                }
            });
        }); };
        this.get_json = this.getJSON;
        this.get_csv = this.getCSV;
        this.filters = filters;
        this.structure = structure;
        this.latestBy = latestBy;
    }
    Object.defineProperty(Cov19API.prototype, "apiParams", {
        get: function () {
            return __assign({ filters: this.filters.join(";"), structure: JSON.stringify(this.structure) }, (this.latestBy ? { latestBy: this.latestBy } : {}));
        },
        enumerable: false,
        configurable: true
    });
    Cov19API.endpoint = "https://api.coronavirus.data.gov.uk/v1/data";
    Cov19API.options = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, status, statusText;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, axios_1.default.options(Cov19API.endpoint, { timeout: 10000 })];
                case 1:
                    _a = _b.sent(), data = _a.data, status = _a.status, statusText = _a.statusText;
                    if (status >= 400)
                        throw new Error(statusText);
                    return [2, data];
            }
        });
    }); };
    return Cov19API;
}());
exports.default = Cov19API;
//# sourceMappingURL=UKCovid19.js.map