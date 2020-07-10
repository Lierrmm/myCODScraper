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
exports.__esModule = true;
var puppeteer = require("puppeteer");
var fs = require("fs");
var url_1 = require("url");
var blockedTypes = ["font", "image", "media", "other", "xhr", "fetch", "stylesheet"];
var allowedHosts = ["my.callofduty.com", "profile.callofduty.com"];
function genString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, UserAgent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, puppeteer.launch()];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _a.sent();
                UserAgent = genString(256);
                return [4 /*yield*/, console.log("Generated Random UserAgent: " + UserAgent)];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.setUserAgent(UserAgent)];
            case 4:
                _a.sent();
                return [4 /*yield*/, console.log("Setting up Interception...")];
            case 5:
                _a.sent();
                return [4 /*yield*/, page.setRequestInterception(true)];
            case 6:
                _a.sent();
                return [4 /*yield*/, console.log("Loading Page...")];
            case 7:
                _a.sent();
                return [4 /*yield*/, console.log("Blocking non JS files...")];
            case 8:
                _a.sent();
                return [4 /*yield*/, page.on('request', function (request) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (blockedTypes.includes(request.resourceType()))
                                request.abort();
                            else
                                request["continue"]();
                            return [2 /*return*/];
                        });
                    }); })];
            case 9:
                _a.sent();
                return [4 /*yield*/, console.log("Hooking Responses...")];
            case 10:
                _a.sent();
                return [4 /*yield*/, page.on('response', function (response) { return __awaiter(void 0, void 0, void 0, function () {
                        var url, filePath, buffer;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    url = new url_1.URL(response.url());
                                    filePath = "./output/javascript/" + url.pathname.split('/').pop();
                                    if (!(filePath.endsWith(".js") && allowedHosts.includes(url.hostname))) return [3 /*break*/, 3];
                                    return [4 /*yield*/, response.buffer()];
                                case 1:
                                    buffer = _a.sent();
                                    console.log("Writing", buffer.length, "bytes >", filePath);
                                    return [4 /*yield*/, fs.writeFileSync(filePath, buffer)];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 11:
                _a.sent();
                return [4 /*yield*/, page.goto("https://my.callofduty.com/login", { waitUntil: 'networkidle2' }).then(function () {
                        console.log("DOM loaded. Done.");
                    })["catch"](function (err) {
                        console.log(err.message);
                    })];
            case 12:
                _a.sent();
                return [4 /*yield*/, browser.close()];
            case 13:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
