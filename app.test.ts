import RGFYBuilder, {
    RGFYEscapedCharacters,
    RGFYRegularOccurences,
} from './app';

test('empty', () => {
    const regexp = new RGFYBuilder().end();
    expect(regexp.test('')).toBe(true);
});

test('word', () => {
    const regexp = new RGFYBuilder().startGroup().word().endGroup().end();
    expect(regexp.test('word')).toBe(true);
});

test('any of', () => {
    const regexp = new RGFYBuilder()
        .startGroup()
        .anyOf('1', '2')
        .endGroup()
        .end();

    expect(regexp.test('12')).toBe(true);
});

test('not in', () => {
    const regexp = new RGFYBuilder()
        .startGroup()
        .notIn('1', '2')
        .endGroup()
        .end();

    expect(regexp.test('23')).toBe(true);
});

test('expression', () => {
    const regexp = new RGFYBuilder({ startStrict: true })
        .startGroup()
        .expression('test')
        .endGroup()
        .end({ strict: true });

    expect(regexp.test('test')).toBe(true);
});

test('back ref', () => {
    const regexp = new RGFYBuilder({ startStrict: true })
        .startGroup('groupA', { exact: 1 })
        .word(RGFYRegularOccurences.ONE_OR_MORE)
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

test('child group', () => {
    const regexp = new RGFYBuilder({ startStrict: true })
        .startGroup('ParentA')
        .word({ exact: 4 })
        .startGroup('ChildA')
        .digit()
        .endGroup()
        .startGroup()
        .backReference('ChildA')
        .endGroup()
        .endGroup()
        .startGroup()
        .backReference('ParentA')
        .endGroup()
        .end({ strict: true });

    expect(regexp.test('test11test11')).toBe(true);
    expect(regexp.test('test12test12')).toBe(false);
});

describe('use cases', () => {
    test('email', () => {
        const regexp = new RGFYBuilder({ startStrict: true })
            .startGroup(RGFYRegularOccurences.ZERO_OR_MORE)
            .word(RGFYRegularOccurences.ONE_OR_MORE)
            .expression(RGFYEscapedCharacters.DOT)
            .endGroup()
            .startGroup()
            .word(RGFYRegularOccurences.ONE_OR_MORE)
            .expression('@')
            .endGroup()
            .startGroup(RGFYRegularOccurences.ZERO_OR_MORE)
            .word(RGFYRegularOccurences.ONE_OR_MORE)
            .expression(RGFYEscapedCharacters.DOT)
            .endGroup()
            .startGroup()
            .word(RGFYRegularOccurences.ONE_OR_MORE)
            .endGroup()
            .end({ strict: true });

        expect(regexp.test('test@test.com')).toBe(true);
        expect(regexp.test('test.@test.com')).toBe(false);
        expect(regexp.test('test.@test.com')).toBe(false);
        expect(regexp.test('test.com')).toBe(false);
        expect(regexp.test('.com')).toBe(false);
        expect(regexp.test('test@.com')).toBe(false);
        expect(regexp.test('test@com.')).toBe(false);
    });

    test('website url', () => {
        const regexp = new RGFYBuilder({ startStrict: true })
            .startGroup(RGFYRegularOccurences.ZERO_OR_ONE)
            .startGroup()
            .thisOneOrNextOne()
            .expression('http://')
            .endGroup()
            .startGroup()
            .expression('https://')
            .endGroup()
            .endGroup()
            .startGroup(RGFYRegularOccurences.ZERO_OR_MORE)
            .word(RGFYRegularOccurences.ONE_OR_MORE)
            .expression(RGFYEscapedCharacters.DOT)
            .endGroup()
            .startGroup()
            .word(RGFYRegularOccurences.ONE_OR_MORE)
            .endGroup()
            .end({ strict: true });

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

    test('first last name', () => {
        const regexp = new RGFYBuilder({
            startStrict: true,
            caseInsensitive: false,
        })
            .startGroup()
            .charBetween('A', 'Z')
            .word(RGFYRegularOccurences.ONE_OR_MORE)
            .expression(RGFYEscapedCharacters.WHITE_SPACE)
            .charBetween('A', 'Z')
            .word(RGFYRegularOccurences.ONE_OR_MORE)
            .endGroup()
            .end();

        expect(regexp.test('John Doe')).toBe(true);
        expect(regexp.test('JohnDoe')).toBe(false);
        expect(regexp.test('John doe')).toBe(false);
        expect(regexp.test('john Doe')).toBe(false);
    });

    test('postal code', () => {
        const regexp = new RGFYBuilder({
            startStrict: true,
            caseInsensitive: false,
        })
            .startGroup()
            .charBetween('A', 'Z')
            .digit()
            .charBetween('A', 'Z')
            .expression(RGFYEscapedCharacters.WHITE_SPACE)
            .digit()
            .charBetween('A', 'Z')
            .digit()
            .endGroup()
            .end({ strict: true });

        expect(regexp.test('G1R 2L9')).toBe(true);
        expect(regexp.test('G1R 229')).toBe(false);
        expect(regexp.test('G1R2L9')).toBe(false);
        expect(regexp.test('g1r 2l9')).toBe(false);
    });

    test('phone number', () => {
        const regexp = new RGFYBuilder({
            startStrict: true,
        })
            .startGroup()
            .expression(
                RGFYEscapedCharacters.OPEN_PARENTHESES,
                RGFYRegularOccurences.ZERO_OR_ONE
            )
            .digit({ exact: 3 })
            .expression(
                RGFYEscapedCharacters.CLOSE_PARENTHESES,
                RGFYRegularOccurences.ZERO_OR_ONE
            )
            .endGroup()
            .startGroup('dashFormat')
            .startGroup()
            .thisOneOrNextOne()
            .expression('-')
            .endGroup()
            .startGroup()
            .thisOneOrNextOne()
            .expression('.')
            .endGroup()
            .startGroup()
            .expression(RGFYEscapedCharacters.WHITE_SPACE)
            .endGroup()
            .endGroup()
            .startGroup()
            .digit({ exact: 3 })
            .endGroup()
            .startGroup()
            .backReference('dashFormat')
            .endGroup()
            .startGroup()
            .digit({ exact: 4 })
            .endGroup()
            .end({ strict: true });

        expect(regexp.test('999-123-1234')).toBe(true);
        expect(regexp.test('(999)-123-1234')).toBe(true);
        expect(regexp.test('999.123.1234')).toBe(true);
        expect(regexp.test('(999).123.1234')).toBe(true);
        expect(regexp.test('999 123 1234')).toBe(true);
        expect(regexp.test('(999) 123 1234')).toBe(true);

        expect(regexp.test('999-123.1234')).toBe(false);
        expect(regexp.test('999 123-1234')).toBe(false);
        expect(regexp.test('999.123 1234')).toBe(false);
    });
});
