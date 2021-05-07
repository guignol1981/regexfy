export declare enum RegexGroupBuilderOccurences {
    ZERO_OR_MORE = "*",
    ONE_OR_MORE = "+",
    ZERO_OR_ONE = "?"
}
export declare enum RegexBuilderEscapedCharacters {
    DOT = "\\.",
    BACKSLASH = "\\",
    STAR = "*",
    WHITE_SPACE = "\\s",
    TAB = "\\t",
    LINE_FEED = "\\n",
    CARRIAGE_RETURN = "\\r"
}
export interface RegexGroupBuilderOptions {
    occurence?: RegexGroupBuilderOccurences;
    occurenceCount?: number | {
        min: number;
        max?: number;
    };
    ref?: string;
}
export declare class RegexGroupBuilder {
    private regexBuilder;
    readonly options: RegexGroupBuilderOptions;
    regexp: string;
    backRef: string;
    meOrNext: boolean;
    constructor(regexBuilder: RegexBuilder, options: RegexGroupBuilderOptions);
    word(): RegexGroupBuilder;
    notWord(): RegexGroupBuilder;
    digit(): RegexGroupBuilder;
    notDigit(): RegexGroupBuilder;
    whiteSpace(): RegexGroupBuilder;
    notWhiteSpace(): RegexGroupBuilder;
    anyOf(...candidates: string[]): RegexGroupBuilder;
    notIn(...excluded: string[]): RegexGroupBuilder;
    backReference(ref: string): RegexGroupBuilder;
    charBetween(lowerChar: string, upperChar: string): RegexGroupBuilder;
    endGroup(): RegexBuilder;
}
export interface RegexBuilderOptions {
    global?: boolean;
    caseInsensitive?: boolean;
    startStrict?: boolean;
}
export default class RegexBuilder {
    private options;
    private groupBuilders;
    constructor(options?: RegexBuilderOptions);
    startGroup(options?: RegexGroupBuilderOptions): RegexGroupBuilder;
    or(): RegexBuilder;
    end(options?: {
        strict?: boolean;
    }): RegExp;
}
//# sourceMappingURL=app.d.ts.map