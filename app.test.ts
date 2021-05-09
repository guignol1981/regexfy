import RGFYRegexBuilder, {
    RegexBuilderEscapedCharacters,
    RGFYGroupBuilder,
} from './app';
import RGFYregexpBuilder, { RGFYRegularOccurences } from './app';

test('empty', () => {
    const regexp = new RGFYregexpBuilder().end();
    expect(regexp.test('')).toBe(true);
});

test('word', () => {
    const regexp = new RGFYregexpBuilder().startGroup().word().endGroup().end();
    expect(regexp.test('word')).toBe(true);
});

test('any of', () => {
    const regexp = new RGFYregexpBuilder()
        .startGroup()
        .anyOf('1', '2')
        .endGroup()
        .end();

    expect(regexp.test('12')).toBe(true);
});

test('not in', () => {
    const regexp = new RGFYregexpBuilder()
        .startGroup()
        .notIn('1', '2')
        .endGroup()
        .end();

    expect(regexp.test('23')).toBe(true);
});

test('back ref', () => {
    const regexp = new RGFYregexpBuilder({ startStrict: true })
        .startGroup({ ref: 'groupA' })
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
    const regexp = new RGFYRegexBuilder({ startStrict: true })
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

describe('use cases', () => {
    test('email', () => {
        const regexp = new RGFYRegexBuilder({ startStrict: true })
            .startGroup({
                occurence: RGFYRegularOccurences.ONE_OR_MORE,
                ref: 'groupA',
            })
            .word(RGFYRegularOccurences.ONE_OR_MORE)
            .startGroup({ occurence: RGFYRegularOccurences.ZERO_OR_ONE })
            .anyOf(RegexBuilderEscapedCharacters.DOT)
            .endGroup()
            .endGroup()
            .startGroup()
            .word(RGFYRegularOccurences.ONE_OR_MORE)
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

    test('website url', () => {
        const regexp = new RGFYRegexBuilder({ startStrict: true })
            .startGroup({ occurence: RGFYRegularOccurences.ZERO_OR_ONE })
            .startGroup({ or: true })
            .expression('http://')
            .endGroup()
            .startGroup()
            .expression('https://')
            .endGroup()
            .endGroup()
            .startGroup({ occurence: RGFYRegularOccurences.ONE_OR_MORE })
            .word(RGFYRegularOccurences.ONE_OR_MORE)
            .startGroup({ occurence: { exact: 1 } })
            .anyOf(RegexBuilderEscapedCharacters.DOT)
            .endGroup()
            .endGroup()
            .startGroup({ occurence: { exact: 1 } })
            .word(RGFYRegularOccurences.ONE_OR_MORE)
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
