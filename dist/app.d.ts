export declare enum RGFYRegularOccurences {
    ZERO_OR_MORE = "*",
    ONE_OR_MORE = "+",
    ZERO_OR_ONE = "?"
}
export declare enum RGFYEscapedCharacters {
    DOT = "\\.",
    BACKSLASH = "\\",
    STAR = "*",
    WHITE_SPACE = "\\s",
    TAB = "\\t",
    LINE_FEED = "\\n",
    CARRIAGE_RETURN = "\\r"
}
export interface RGFYOccurenceBound {
    min?: number;
    max?: number;
    exact?: number;
}
export interface RGFYGroupBuilderOptions {
    occurence?: RGFYRegularOccurences | RGFYOccurenceBound;
    ref?: string;
}
export interface RGFYGroupParent {
    regexp?: string;
    ref?: string;
    backRef?: string;
    or?: boolean;
    occurence: RGFYRegularOccurences | RGFYOccurenceBound;
    startGroup(): RGFYGroupBuilder;
    startGroup(ref: string): RGFYGroupBuilder;
    startGroup(occurence: RGFYRegularOccurences | RGFYOccurenceBound): RGFYGroupBuilder;
    startGroup(ref: string, occurence: RGFYRegularOccurences | RGFYOccurenceBound): RGFYGroupBuilder;
    startGroup(...args: any): RGFYGroupBuilder;
    endGroup(): RGFYGroupParent;
    end(options?: {
        strict?: boolean;
    }): RegExp;
}
export declare class RGFYGroupBuilder implements RGFYGroupParent {
    private groupParent;
    private groupOffset;
    regexp: string;
    readonly ref: string;
    backRef: string;
    or: boolean;
    readonly occurence: RGFYRegularOccurences | RGFYOccurenceBound;
    private groupParents;
    constructor(groupParent: RGFYGroupParent, groupOffset: number, options: RGFYGroupBuilderOptions);
    startGroup(): RGFYGroupBuilder;
    startGroup(ref: string, occurence: RGFYRegularOccurences | RGFYOccurenceBound): RGFYGroupBuilder;
    startGroup(occurence: RGFYRegularOccurences | RGFYOccurenceBound): RGFYGroupBuilder;
    startGroup(ref: string): RGFYGroupBuilder;
    thisOneOrNextOne(): RGFYGroupBuilder;
    backReference(ref: string): RGFYGroupBuilder;
    expression(expression: string, occurence?: RGFYRegularOccurences | RGFYOccurenceBound): RGFYGroupBuilder;
    word(occurence?: RGFYRegularOccurences | RGFYOccurenceBound): RGFYGroupBuilder;
    notWord(occurence?: RGFYRegularOccurences | RGFYOccurenceBound): RGFYGroupBuilder;
    digit(occurence?: RGFYRegularOccurences | RGFYOccurenceBound): RGFYGroupBuilder;
    notDigit(occurence?: RGFYRegularOccurences | RGFYOccurenceBound): RGFYGroupBuilder;
    whiteSpace(occurence?: RGFYRegularOccurences | RGFYOccurenceBound): RGFYGroupBuilder;
    notWhiteSpace(occurence?: RGFYRegularOccurences | RGFYOccurenceBound): RGFYGroupBuilder;
    anyOf(...candidates: string[]): RGFYGroupBuilder;
    notIn(...excluded: string[]): RGFYGroupBuilder;
    charBetween(lowerChar: string, upperChar: string): RGFYGroupBuilder;
    endGroup(): RGFYGroupParent;
    end(): RegExp;
}
export interface RGFYBuilderOptions {
    global?: boolean;
    caseInsensitive?: boolean;
    startStrict?: boolean;
}
export default class RGFYBuilder implements RGFYGroupParent {
    private readonly options;
    regexp: string;
    private groupParents;
    readonly occurence: RGFYOccurenceBound;
    constructor(options?: RGFYBuilderOptions);
    startGroup(): RGFYGroupBuilder;
    startGroup(ref: string, occurence: RGFYRegularOccurences | RGFYOccurenceBound): RGFYGroupBuilder;
    startGroup(occurence: RGFYRegularOccurences | RGFYOccurenceBound): RGFYGroupBuilder;
    startGroup(ref: string): RGFYGroupBuilder;
    endGroup(): RGFYGroupParent;
    end(options?: {
        strict?: boolean;
    }): RegExp;
}
//# sourceMappingURL=app.d.ts.map