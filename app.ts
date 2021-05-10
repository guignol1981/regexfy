export enum RGFYRegularOccurences {
    ZERO_OR_MORE = '*',
    ONE_OR_MORE = '+',
    ZERO_OR_ONE = '?',
}

export enum RGFYEscapedCharacters {
    DOT = `\\.`,
    BACKSLASH = `\\`,
    STAR = `\*`,
    WHITE_SPACE = `\\s`,
    TAB = '\\t',
    LINE_FEED = '\\n',
    CARRIAGE_RETURN = '\\r',
    OPEN_PARENTHESES = '\\(',
    CLOSE_PARENTHESES = '\\)',
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
    startGroup(
        occurence: RGFYRegularOccurences | RGFYOccurenceBound
    ): RGFYGroupBuilder;
    startGroup(
        ref: string,
        occurence: RGFYRegularOccurences | RGFYOccurenceBound
    ): RGFYGroupBuilder;
    startGroup(...args: any): RGFYGroupBuilder;
    endGroup(): RGFYGroupParent;
    end(options?: { strict?: boolean }): RegExp;
}

export class RGFYGroupBuilder implements RGFYGroupParent {
    public regexp: string = '';
    public readonly ref: string;
    public backRef: string = '';
    public or: boolean = false;
    public readonly occurence: RGFYRegularOccurences | RGFYOccurenceBound;
    private groupParents: (RGFYGroupParent & RGFYGroupBuilder)[] = [];

    public constructor(
        private groupParent: RGFYGroupParent,
        private groupOffset: number = 0,
        options: RGFYGroupBuilderOptions
    ) {
        this.ref = options.ref!;
        this.occurence = options.occurence || { exact: 1 };
    }

    public startGroup(): RGFYGroupBuilder;
    public startGroup(
        ref: string,
        occurence: RGFYRegularOccurences | RGFYOccurenceBound
    ): RGFYGroupBuilder;
    public startGroup(
        occurence: RGFYRegularOccurences | RGFYOccurenceBound
    ): RGFYGroupBuilder;
    public startGroup(ref: string): RGFYGroupBuilder;
    public startGroup(...args: any[]): RGFYGroupBuilder {
        const opts: RGFYGroupBuilderOptions = {};

        if (args[0] && typeof args[0] === 'string') {
            opts.ref = args[0];
        } else if (
            args[0] &&
            Object.values(RGFYRegularOccurences).includes(args[0])
        ) {
            opts.occurence = args[0];
        }

        if (args[1] && Object.values(RGFYRegularOccurences).includes(args[1])) {
            opts.occurence = args[1];
        }

        if (!opts.ref) {
            opts.ref = (this.groupParents.length + 1).toString();
        }

        this.groupParents.push(
            new RGFYGroupBuilder(
                this,
                this.groupOffset + this.groupParents.length + 1,
                opts
            )
        );

        return this.groupParents[this.groupParents.length - 1];
    }

    public thisOneOrNextOne(): RGFYGroupBuilder {
        this.or = true;
        return this;
    }

    public backReference(ref: string): RGFYGroupBuilder {
        this.backRef = ref;
        return this;
    }

    public expression(
        expression: string,
        occurence: RGFYRegularOccurences | RGFYOccurenceBound = { exact: 1 }
    ): RGFYGroupBuilder {
        this.regexp += expression + parseOccurence(occurence);
        return this;
    }

    public word(
        occurence: RGFYRegularOccurences | RGFYOccurenceBound = { exact: 1 }
    ): RGFYGroupBuilder {
        this.regexp += `\\w` + parseOccurence(occurence);
        return this;
    }

    public notWord(
        occurence: RGFYRegularOccurences | RGFYOccurenceBound = { exact: 1 }
    ): RGFYGroupBuilder {
        this.regexp += `\\W` + parseOccurence(occurence);
        return this;
    }

    public digit(
        occurence: RGFYRegularOccurences | RGFYOccurenceBound = { exact: 1 }
    ): RGFYGroupBuilder {
        this.regexp += `\\d` + parseOccurence(occurence);
        return this;
    }

    public notDigit(
        occurence: RGFYRegularOccurences | RGFYOccurenceBound = { exact: 1 }
    ): RGFYGroupBuilder {
        this.regexp += `\\D` + parseOccurence(occurence);
        return this;
    }

    public whiteSpace(
        occurence: RGFYRegularOccurences | RGFYOccurenceBound = { exact: 1 }
    ): RGFYGroupBuilder {
        this.regexp += `\\s` + parseOccurence(occurence);
        return this;
    }

    public notWhiteSpace(
        occurence: RGFYRegularOccurences | RGFYOccurenceBound = { exact: 1 }
    ): RGFYGroupBuilder {
        this.regexp += `\\S` + parseOccurence(occurence);
        return this;
    }

    public anyOf(...candidates: string[]): RGFYGroupBuilder {
        this.regexp += `[${candidates.join(``)}]`;
        return this;
    }

    public notIn(...excluded: string[]): RGFYGroupBuilder {
        this.regexp += `[^${excluded.join(``)}]`;
        return this;
    }

    public charBetween(lowerChar: string, upperChar: string): RGFYGroupBuilder {
        this.regexp += `[${lowerChar}-${upperChar}]`;
        return this;
    }

    public endGroup(): RGFYGroupParent {
        this.regexp += getGroupParentsRegexp(
            this.groupParents,
            this.groupOffset
        );
        return this.groupParent;
    }

    public end(): RegExp {
        throw 'do not use on children';
    }
}

export interface RGFYBuilderOptions {
    global?: boolean;
    caseInsensitive?: boolean;
    startStrict?: boolean;
}

export default class RGFYBuilder implements RGFYGroupParent {
    public regexp: string = '';
    private groupParents: (RGFYGroupParent & RGFYGroupBuilder)[] = [];
    public readonly occurence: RGFYOccurenceBound = { exact: 1 };

    public constructor(private readonly options: RGFYBuilderOptions = {}) {}

    public startGroup(): RGFYGroupBuilder;
    public startGroup(
        ref: string,
        occurence: RGFYRegularOccurences | RGFYOccurenceBound
    ): RGFYGroupBuilder;
    public startGroup(
        occurence: RGFYRegularOccurences | RGFYOccurenceBound
    ): RGFYGroupBuilder;
    public startGroup(ref: string): RGFYGroupBuilder;
    public startGroup(...args: any[]): RGFYGroupBuilder {
        const opts: RGFYGroupBuilderOptions = {};

        if (args[0] && Object.values(RGFYRegularOccurences).includes(args[0])) {
            opts.occurence = args[0];
        } else if (args[0] && typeof args[0] === 'string') {
            opts.ref = args[0];
        }

        if (args[1] && Object.values(RGFYRegularOccurences).includes(args[1])) {
            opts.occurence = args[1];
        }

        if (!opts.ref) {
            opts.ref = (this.groupParents.length + 1).toString();
        }

        this.groupParents.push(
            new RGFYGroupBuilder(this, this.groupParents.length + 1, opts)
        );

        return this.groupParents[this.groupParents.length - 1];
    }

    public endGroup(): RGFYGroupParent {
        throw 'Do not use on root builder';
    }

    public end(options: { strict?: boolean } = { strict: false }): RegExp {
        if (this.options.startStrict) {
            this.regexp += '^';
        }

        this.regexp += getGroupParentsRegexp(this.groupParents, 0);

        return new RegExp(
            this.regexp + (options.strict ? '$' : ''),
            `${this.options.global ? 'g' : ''}${
                this.options.caseInsensitive ? 'i' : ''
            }`
        );
    }
}

const parseOccurence = (
    occurence: RGFYRegularOccurences | RGFYOccurenceBound
): string => {
    if (Object.values(RGFYRegularOccurences).includes(occurence as any)) {
        return occurence as string;
    }
    const bound: RGFYOccurenceBound = occurence as RGFYOccurenceBound;

    if ('min' in bound) {
        if ('max' in bound) {
            return `{${bound.min}, ${bound.max}}`;
        }
        return `{${bound.min},}`;
    }

    if ('exact' in bound) {
        return `{${bound.exact}}`;
    }

    return '';
};

const getGroupParentsRegexp = (
    groupParents: RGFYGroupParent[],
    offset: number
): string => {
    return groupParents.reduce((acc, cur, _, a) => {
        acc += `(`;
        acc += cur.regexp;

        if (cur.backRef) {
            acc += `\\${a.map((a) => a.ref).indexOf(cur.backRef) + 1 + offset}`;
        }

        acc += `)`;

        acc += parseOccurence(cur.occurence);
        if (cur.or) {
            acc += `|`;
        }

        return acc;
    }, '');
};
