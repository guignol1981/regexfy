"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RGFYGroupBuilder = exports.RGFYEscapedCharacters = exports.RGFYRegularOccurences = void 0;
var RGFYRegularOccurences;
(function (RGFYRegularOccurences) {
    RGFYRegularOccurences["ZERO_OR_MORE"] = "*";
    RGFYRegularOccurences["ONE_OR_MORE"] = "+";
    RGFYRegularOccurences["ZERO_OR_ONE"] = "?";
})(RGFYRegularOccurences = exports.RGFYRegularOccurences || (exports.RGFYRegularOccurences = {}));
var RGFYEscapedCharacters;
(function (RGFYEscapedCharacters) {
    RGFYEscapedCharacters["DOT"] = "\\.";
    RGFYEscapedCharacters["BACKSLASH"] = "\\";
    RGFYEscapedCharacters["STAR"] = "*";
    RGFYEscapedCharacters["WHITE_SPACE"] = "\\s";
    RGFYEscapedCharacters["TAB"] = "\\t";
    RGFYEscapedCharacters["LINE_FEED"] = "\\n";
    RGFYEscapedCharacters["CARRIAGE_RETURN"] = "\\r";
})(RGFYEscapedCharacters = exports.RGFYEscapedCharacters || (exports.RGFYEscapedCharacters = {}));
var RGFYGroupBuilder = /** @class */ (function () {
    function RGFYGroupBuilder(groupParent, groupOffset, options) {
        if (groupOffset === void 0) { groupOffset = 0; }
        this.groupParent = groupParent;
        this.groupOffset = groupOffset;
        this.regexp = '';
        this.backRef = '';
        this.or = false;
        this.groupParents = [];
        this.ref = options.ref;
        this.occurence = options.occurence || { exact: 1 };
    }
    RGFYGroupBuilder.prototype.startGroup = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var opts = {};
        if (args[0] && typeof args[0] === 'string') {
            opts.ref = args[0];
        }
        else if (args[0] &&
            Object.values(RGFYRegularOccurences).includes(args[0])) {
            opts.occurence = args[0];
        }
        if (args[1] && Object.values(RGFYRegularOccurences).includes(args[1])) {
            opts.occurence = args[1];
        }
        if (!opts.ref) {
            opts.ref = (this.groupParents.length + 1).toString();
        }
        this.groupParents.push(new RGFYGroupBuilder(this, this.groupOffset + this.groupParents.length + 1, opts));
        return this.groupParents[this.groupParents.length - 1];
    };
    RGFYGroupBuilder.prototype.thisOneOrNextOne = function () {
        this.or = true;
        return this;
    };
    RGFYGroupBuilder.prototype.backReference = function (ref) {
        this.backRef = ref;
        return this;
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
var RGFYBuilder = /** @class */ (function () {
    function RGFYBuilder(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        this.regexp = '';
        this.groupParents = [];
        this.occurence = { exact: 1 };
    }
    RGFYBuilder.prototype.startGroup = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var opts = {};
        if (args[0] && Object.values(RGFYRegularOccurences).includes(args[0])) {
            opts.occurence = args[0];
        }
        else if (args[0] && typeof args[0] === 'string') {
            opts.ref = args[0];
        }
        if (args[1] && Object.values(RGFYRegularOccurences).includes(args[1])) {
            opts.occurence = args[1];
        }
        if (!opts.ref) {
            opts.ref = (this.groupParents.length + 1).toString();
        }
        this.groupParents.push(new RGFYGroupBuilder(this, this.groupParents.length + 1, opts));
        return this.groupParents[this.groupParents.length - 1];
    };
    RGFYBuilder.prototype.endGroup = function () {
        throw 'Do not use on root builder';
    };
    RGFYBuilder.prototype.end = function (options) {
        if (options === void 0) { options = { strict: false }; }
        if (this.options.startStrict) {
            this.regexp += '^';
        }
        this.regexp += getGroupParentsRegexp(this.groupParents, 0);
        return new RegExp(this.regexp + (options.strict ? '$' : ''), "" + (this.options.global ? 'g' : '') + (this.options.caseInsensitive ? 'i' : ''));
    };
    return RGFYBuilder;
}());
exports.default = RGFYBuilder;
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
