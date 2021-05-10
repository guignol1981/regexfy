[![npm version](https://badge.fury.io/js/regexfy.svg)](https://badge.fury.io/js/regexfy)
[![Build Status](https://travis-ci.com/guignol1981/regexfy.svg?branch=master)](https://travis-ci.com/guignol1981/regexfy)

# regexfy

### installation

npm i regexfy

## Examples

### Postal code

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

### Website url

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
        
### Full name

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
        
### Phone number

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
