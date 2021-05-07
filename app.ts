export enum RegexGroupBuilderOccurences {
    ZERO_OR_MORE = '*',
    ONE_OR_MORE = '+',
    ZERO_OR_ONE = '?',
}

export enum RegexBuilderEscapedCharacters {
    DOT = `\\.`,
    BACKSLASH = `\\`,
    STAR = `\*`,
    WHITE_SPACE = `\\s`,
    TAB = '\\t',
    LINE_FEED = '\\n',
    CARRIAGE_RETURN = '\\r',
}

export interface RegexGroupBuilderOptions {
    occurence?: RegexGroupBuilderOccurences;
    occurenceCount?: number | { min: number; max?: number };
    ref?: string;
}

export class RegexGroupBuilder {
    public regexp: string = '';
    public backRef: string = '';
    public meOrNext: boolean = false;

    public constructor(
        private regexBuilder: RegexBuilder,
        public readonly options: RegexGroupBuilderOptions
    ) {}

    public word(): RegexGroupBuilder {
        this.regexp += `\\w`;
        return this;
    }

    public notWord(): RegexGroupBuilder {
        this.regexp += `\\W`;
        return this;
    }

    public digit(): RegexGroupBuilder {
        this.regexp += `\\d`;
        return this;
    }

    public notDigit(): RegexGroupBuilder {
        this.regexp += `\\D`;
        return this;
    }

    public whiteSpace(): RegexGroupBuilder {
        this.regexp += `\\s`;
        return this;
    }

    public notWhiteSpace(): RegexGroupBuilder {
        this.regexp += `\\S`;
        return this;
    }

    public anyOf(...candidates: string[]): RegexGroupBuilder {
        this.regexp += `[${candidates.join(``)}]`;
        return this;
    }

    public notIn(...excluded: string[]): RegexGroupBuilder {
        this.regexp += `[^${excluded.join(``)}]`;
        return this;
    }

    public backReference(ref: string): RegexGroupBuilder {
        this.backRef = ref;
        return this;
    }

    public charBetween(
        lowerChar: string,
        upperChar: string
    ): RegexGroupBuilder {
        this.regexp += `[${lowerChar}-${upperChar}]`;
        return this;
    }

    public endGroup(): RegexBuilder {
        return this.regexBuilder;
    }
}

export interface RegexBuilderOptions {
    global?: boolean;
    caseInsensitive?: boolean;
    startStrict?: boolean;
}

export default class RegexBuilder {
    private groupBuilders: RegexGroupBuilder[] = [];

    public constructor(private options: RegexBuilderOptions = {}) {}

    public startGroup(options?: RegexGroupBuilderOptions): RegexGroupBuilder {
        this.groupBuilders.push(
            new RegexGroupBuilder(this, {
                ...{
                    ref: (this.groupBuilders.length - 1).toString(),
                },
                ...(options ?? {}),
            })
        );

        return this.groupBuilders[this.groupBuilders.length - 1];
    }

    public or(): RegexBuilder {
        this.groupBuilders[this.groupBuilders.length - 1].meOrNext = true;
        return this;
    }

    public end(options: { strict?: boolean } = { strict: false }): RegExp {
        let built: string = this.groupBuilders.reduce(
            (acc, cur, _, a) => {
                acc += `(`;
                acc += cur.regexp;

                if (cur.backRef) {
                    acc += `\\${
                        a.map((a) => a.options.ref).indexOf(cur.backRef) + 1
                    }`;
                }

                acc += cur.options.occurence ?? '';

                acc += `)`;

                if (cur.options.occurenceCount instanceof Object) {
                    if ('min' in (cur.options.occurenceCount as any)) {
                        if ('max' in (cur.options.occurenceCount as any)) {
                            acc += `{${
                                (cur.options.occurenceCount as any).min
                            },${(cur.options.occurenceCount as any).max}}`;
                        } else {
                            acc += `{${
                                (cur.options.occurenceCount as any).min
                            },}`;
                        }
                    }
                } else if (cur.options.occurenceCount) {
                    acc += `{${cur.options.occurenceCount}}`;
                }

                if (cur.meOrNext) {
                    acc += `|`;
                }

                return acc;
            },
            this.options.startStrict ? '^' : ''
        );

        return new RegExp(
            (built += options.strict ? '$' : ''),
            `${this.options.global ? 'g' : ''}${
                this.options.caseInsensitive ? 'i' : ''
            }`
        );
    }
}
