"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importStar(require("./app"));
var app_2 = __importStar(require("./app"));
test('empty', function () {
    var regexp = new app_2.default().end();
    expect(regexp.test('')).toBe(true);
});
test('word', function () {
    var regexp = new app_2.default().startGroup().word().endGroup().end();
    expect(regexp.test('word')).toBe(true);
});
test('any of', function () {
    var regexp = new app_2.default()
        .startGroup()
        .anyOf('1', '2')
        .endGroup()
        .end();
    expect(regexp.test('12')).toBe(true);
});
test('not in', function () {
    var regexp = new app_2.default()
        .startGroup()
        .notIn('1', '2')
        .endGroup()
        .end();
    expect(regexp.test('23')).toBe(true);
});
test('back ref', function () {
    var regexp = new app_2.default({ startStrict: true })
        .startGroup({ ref: 'groupA' })
        .word(app_2.RGFYRegularOccurences.ONE_OR_MORE)
        .endGroup()
        .startGroup()
        .expression('@')
        .endGroup()
        .startGroup()
        .backReference('groupA')
        .endGroup()
        .end({ strict: true });
    expect(regexp.test('test@test')).toBe(true);
});
test('child group', function () {
    var regexp = new app_1.default({ startStrict: true })
        .startGroup({ ref: 'ParentA' })
        .word({ exact: 4 })
        .startGroup({ ref: 'childA' })
        .digit()
        .endGroup()
        .startGroup({ backRef: 'childA' })
        .endGroup()
        .endGroup()
        .startGroup({ backRef: 'ParentA' })
        .endGroup()
        .end({ strict: true });
    expect(regexp.test('test11test11')).toBe(true);
});
describe('use cases', function () {
    test('email', function () {
        var regexp = new app_1.default({ startStrict: true })
            .startGroup({
            occurence: app_2.RGFYRegularOccurences.ONE_OR_MORE,
            ref: 'groupA',
        })
            .word(app_2.RGFYRegularOccurences.ONE_OR_MORE)
            .startGroup({ occurence: app_2.RGFYRegularOccurences.ZERO_OR_ONE })
            .anyOf(app_1.RegexBuilderEscapedCharacters.DOT)
            .endGroup()
            .endGroup()
            .startGroup()
            .word(app_2.RGFYRegularOccurences.ONE_OR_MORE)
            .endGroup()
            .startGroup()
            .anyOf('@')
            .endGroup()
            .startGroup({ backRef: 'groupA' })
            .endGroup()
            .end();
        expect(regexp.test('test@test.com')).toBe(true);
        expect(regexp.test('test.@test.com')).toBe(false);
        expect(regexp.test('test.@test.com')).toBe(false);
        expect(regexp.test('test.com')).toBe(false);
        expect(regexp.test('.com')).toBe(false);
        expect(regexp.test('test@.com')).toBe(false);
        expect(regexp.test('test@com.')).toBe(false);
    });
    test('website url', function () {
        var regexp = new app_1.default({ startStrict: true })
            .startGroup({ occurence: app_2.RGFYRegularOccurences.ZERO_OR_ONE })
            .startGroup({ or: true })
            .expression('http://')
            .endGroup()
            .startGroup()
            .expression('https://')
            .endGroup()
            .endGroup()
            .startGroup({ occurence: app_2.RGFYRegularOccurences.ONE_OR_MORE })
            .word(app_2.RGFYRegularOccurences.ONE_OR_MORE)
            .startGroup({ occurence: { exact: 1 } })
            .anyOf(app_1.RegexBuilderEscapedCharacters.DOT)
            .endGroup()
            .endGroup()
            .startGroup({ occurence: { exact: 1 } })
            .word(app_2.RGFYRegularOccurences.ONE_OR_MORE)
            .endGroup()
            .end({ strict: true });
        console.log(regexp);
        expect(regexp.test('www.google.com')).toBe(true);
        expect(regexp.test('http://www.google.com')).toBe(true);
        expect(regexp.test('https://www.google.com')).toBe(true);
        expect(regexp.test('htttps://www.google.com')).toBe(false);
        expect(regexp.test('htttps://.com')).toBe(false);
        expect(regexp.test('htttps://com.')).toBe(false);
        expect(regexp.test('htttps://')).toBe(false);
        expect(regexp.test('htttps://.')).toBe(false);
        expect(regexp.test('htttps://com')).toBe(false);
        expect(regexp.test('www.google.com.')).toBe(false);
        expect(regexp.test('www.google.com.')).toBe(false);
    });
});
