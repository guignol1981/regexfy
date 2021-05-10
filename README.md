[![npm version](https://badge.fury.io/js/regexfy.svg)](https://badge.fury.io/js/regexfy)
[![Build Status](https://travis-ci.com/guignol1981/regexfy.svg?branch=master)](https://travis-ci.com/guignol1981/regexfy)

# regexfy

### installation

npm i regexfy

### example

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
