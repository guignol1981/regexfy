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
exports.RegexGroupBuilder = exports.RegexBuilderEscapedCharacters = exports.RegexGroupBuilderOccurences = void 0;
var RegexGroupBuilderOccurences;
(function (RegexGroupBuilderOccurences) {
    RegexGroupBuilderOccurences["ZERO_OR_MORE"] = "*";
    RegexGroupBuilderOccurences["ONE_OR_MORE"] = "+";
    RegexGroupBuilderOccurences["ZERO_OR_ONE"] = "?";
})(RegexGroupBuilderOccurences = exports.RegexGroupBuilderOccurences || (exports.RegexGroupBuilderOccurences = {}));
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
var RegexGroupBuilder = /** @class */ (function () {
    function RegexGroupBuilder(regexBuilder, options) {
        this.regexBuilder = regexBuilder;
        this.options = options;
        this.regexp = '';
        this.backRef = '';
        this.meOrNext = false;
    }
    RegexGroupBuilder.prototype.word = function () {
        this.regexp += "\\w";
        return this;
    };
    RegexGroupBuilder.prototype.notWord = function () {
        this.regexp += "\\W";
        return this;
    };
    RegexGroupBuilder.prototype.digit = function () {
        this.regexp += "\\d";
        return this;
    };
    RegexGroupBuilder.prototype.notDigit = function () {
        this.regexp += "\\D";
        return this;
    };
    RegexGroupBuilder.prototype.whiteSpace = function () {
        this.regexp += "\\s";
        return this;
    };
    RegexGroupBuilder.prototype.notWhiteSpace = function () {
        this.regexp += "\\S";
        return this;
    };
    RegexGroupBuilder.prototype.anyOf = function () {
        var candidates = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            candidates[_i] = arguments[_i];
        }
        this.regexp += "[" + candidates.join("") + "]";
        return this;
    };
    RegexGroupBuilder.prototype.notIn = function () {
        var excluded = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            excluded[_i] = arguments[_i];
        }
        this.regexp += "[^" + excluded.join("") + "]";
        return this;
    };
    RegexGroupBuilder.prototype.backReference = function (ref) {
        this.backRef = ref;
        return this;
    };
    RegexGroupBuilder.prototype.charBetween = function (lowerChar, upperChar) {
        this.regexp += "[" + lowerChar + "-" + upperChar + "]";
        return this;
    };
    RegexGroupBuilder.prototype.endGroup = function () {
        return this.regexBuilder;
    };
    return RegexGroupBuilder;
}());
exports.RegexGroupBuilder = RegexGroupBuilder;
var RegexBuilder = /** @class */ (function () {
    function RegexBuilder(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        this.groupBuilders = [];
    }
    RegexBuilder.prototype.startGroup = function (options) {
        this.groupBuilders.push(new RegexGroupBuilder(this, __assign({
            ref: (this.groupBuilders.length - 1).toString(),
        }, (options !== null && options !== void 0 ? options : {}))));
        return this.groupBuilders[this.groupBuilders.length - 1];
    };
    RegexBuilder.prototype.or = function () {
        this.groupBuilders[this.groupBuilders.length - 1].meOrNext = true;
        return this;
    };
    RegexBuilder.prototype.end = function (options) {
        if (options === void 0) { options = { strict: false }; }
        var built = this.groupBuilders.reduce(function (acc, cur, _, a) {
            var _a;
            acc += "(";
            acc += cur.regexp;
            if (cur.backRef) {
                acc += "\\" + (a.map(function (a) { return a.options.ref; }).indexOf(cur.backRef) + 1);
            }
            acc += (_a = cur.options.occurence) !== null && _a !== void 0 ? _a : '';
            acc += ")";
            if (cur.options.occurenceCount instanceof Object) {
                if ('min' in cur.options.occurenceCount) {
                    if ('max' in cur.options.occurenceCount) {
                        acc += "{" + cur.options.occurenceCount.min + "," + cur.options.occurenceCount.max + "}";
                    }
                    else {
                        acc += "{" + cur.options.occurenceCount.min + ",}";
                    }
                }
            }
            else if (cur.options.occurenceCount) {
                acc += "{" + cur.options.occurenceCount + "}";
            }
            if (cur.meOrNext) {
                acc += "|";
            }
            return acc;
        }, this.options.startStrict ? '^' : '');
        return new RegExp((built += options.strict ? '$' : ''), "" + (this.options.global ? 'g' : '') + (this.options.caseInsensitive ? 'i' : ''));
    };
    return RegexBuilder;
}());
exports.default = RegexBuilder;
