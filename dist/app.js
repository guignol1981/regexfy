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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RGFYGroupBuilder = exports.RegexBuilderEscapedCharacters = exports.RGFYRegularOccurences = void 0;
var RGFYRegularOccurences;
(function (RGFYRegularOccurences) {
    RGFYRegularOccurences["ZERO_OR_MORE"] = "*";
    RGFYRegularOccurences["ONE_OR_MORE"] = "+";
    RGFYRegularOccurences["ZERO_OR_ONE"] = "?";
})(RGFYRegularOccurences = exports.RGFYRegularOccurences || (exports.RGFYRegularOccurences = {}));
var RegexBuilderEscapedCharacters;
(function (RegexBuilderEscapedCharacters) {
    RegexBuilderEscapedCharacters["DOT"] = "\\.";
    RegexBuilderEscapedCharacters["BACKSLASH"] = "\\";
    RegexBuilderEscapedCharacters["STAR"] = "*";
    RegexBuilderEscapedCharacters["WHITE_SPACE"] = "\\s";
    RegexBuilderEscapedCharacters["TAB"] = "\\t";
    RegexBuilderEscapedCharacters["LINE_FEED"] = "\\n";
    RegexBuilderEscapedCharacters["CARRIAGE_RETURN"] = "\\r";
})(RegexBuilderEscapedCharacters = exports.RegexBuilderEscapedCharacters || (exports.RegexBuilderEscapedCharacters = {}));
var RGFYGroupBuilder = /** @class */ (function () {
    function RGFYGroupBuilder(groupParent, groupOffset, options) {
        if (groupOffset === void 0) { groupOffset = 0; }
        var _a;
        this.groupParent = groupParent;
        this.groupOffset = groupOffset;
        this.regexp = '';
        this.backRef = '';
        this.or = false;
        this.groupParents = [];
        this.ref = options.ref;
        this.backRef = (_a = options.backRef) !== null && _a !== void 0 ? _a : '';
        this.or = !!options.or;
        this.occurence = options.occurence || { exact: 1 };
    }
    RGFYGroupBuilder.prototype.startGroup = function (options) {
        this.groupParents.push(new RGFYGroupBuilder(this, this.groupOffset + this.groupParents.length + 1, __assign({
            ref: (this.groupParents.length - 1).toString(),
        }, (options !== null && options !== void 0 ? options : {}))));
        return this.groupParents[this.groupParents.length - 1];
    };
    RGFYGroupBuilder.prototype.expression = function (expression, occurence) {
        if (occurence === void 0) { occurence = { exact: 1 }; }
        this.regexp += expression + parseOccurence(occurence);
        return this;
    };
    RGFYGroupBuilder.prototype.word = function (occurence) {
        if (occurence === void 0) { occurence = { exact: 1 }; }
        this.regexp += "\\w" + parseOccurence(occurence);
        return this;
    };
    RGFYGroupBuilder.prototype.notWord = function (occurence) {
        if (occurence === void 0) { occurence = { exact: 1 }; }
        this.regexp += "\\W" + parseOccurence(occurence);
        return this;
    };
    RGFYGroupBuilder.prototype.digit = function (occurence) {
        if (occurence === void 0) { occurence = { exact: 1 }; }
        this.regexp += "\\d" + parseOccurence(occurence);
        return this;
    };
    RGFYGroupBuilder.prototype.notDigit = function (occurence) {
        if (occurence === void 0) { occurence = { exact: 1 }; }
        this.regexp += "\\D" + parseOccurence(occurence);
        return this;
    };
    RGFYGroupBuilder.prototype.whiteSpace = function (occurence) {
        if (occurence === void 0) { occurence = { exact: 1 }; }
        this.regexp += "\\s" + parseOccurence(occurence);
        return this;
    };
    RGFYGroupBuilder.prototype.notWhiteSpace = function (occurence) {
        if (occurence === void 0) { occurence = { exact: 1 }; }
        this.regexp += "\\S" + parseOccurence(occurence);
        return this;
    };
    RGFYGroupBuilder.prototype.anyOf = function () {
        var candidates = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            candidates[_i] = arguments[_i];
        }
        this.regexp += "[" + candidates.join("") + "]";
        return this;
    };
    RGFYGroupBuilder.prototype.notIn = function () {
        var excluded = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            excluded[_i] = arguments[_i];
        }
        this.regexp += "[^" + excluded.join("") + "]";
        return this;
    };
    RGFYGroupBuilder.prototype.backReference = function (ref) {
        this.backRef = ref;
        return this;
    };
    RGFYGroupBuilder.prototype.charBetween = function (lowerChar, upperChar) {
        this.regexp += "[" + lowerChar + "-" + upperChar + "]";
        return this;
    };
    RGFYGroupBuilder.prototype.endGroup = function () {
        this.regexp += getGroupParentsRegexp(this.groupParents, this.groupOffset);
        return this.groupParent;
    };
    RGFYGroupBuilder.prototype.end = function () {
        throw 'do not use on children';
    };
    return RGFYGroupBuilder;
}());
exports.RGFYGroupBuilder = RGFYGroupBuilder;
var RGFYRegexBuilder = /** @class */ (function () {
    function RGFYRegexBuilder(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        this.regexp = '';
        this.groupParents = [];
        this.occurence = { exact: 1 };
    }
    RGFYRegexBuilder.prototype.startGroup = function (options) {
        this.groupParents.push(new RGFYGroupBuilder(this, this.groupParents.length + 1, __assign({
            ref: (this.groupParents.length - 1).toString(),
        }, (options !== null && options !== void 0 ? options : {}))));
        return this.groupParents[this.groupParents.length - 1];
    };
    RGFYRegexBuilder.prototype.endGroup = function () {
        throw 'Do not use on root builder';
    };
    RGFYRegexBuilder.prototype.end = function (options) {
        if (options === void 0) { options = { strict: false }; }
        if (this.options.startStrict) {
            this.regexp += '^';
        }
        this.regexp += getGroupParentsRegexp(this.groupParents, 0);
        return new RegExp(this.regexp + (options.strict ? '$' : ''), "" + (this.options.global ? 'g' : '') + (this.options.caseInsensitive ? 'i' : ''));
    };
    return RGFYRegexBuilder;
}());
exports.default = RGFYRegexBuilder;
var parseOccurence = function (occurence) {
    if (Object.values(RGFYRegularOccurences).includes(occurence)) {
        return occurence;
    }
    var bound = occurence;
    if ('min' in bound) {
        if ('max' in bound) {
            return "{" + bound.min + ", " + bound.max + "}";
        }
        return "{" + bound.min + ",}";
    }
    if ('exact' in bound) {
        return "{" + bound.exact + "}";
    }
    return '';
};
var getGroupParentsRegexp = function (groupParents, offset) {
    return groupParents.reduce(function (acc, cur, _, a) {
        acc += "(";
        acc += cur.regexp;
        if (cur.backRef) {
            acc += "\\" + (a.map(function (a) { return a.ref; }).indexOf(cur.backRef) + 1 + offset);
        }
        acc += ")";
        acc += parseOccurence(cur.occurence);
        if (cur.or) {
            acc += "|";
        }
        return acc;
    }, '');
};
