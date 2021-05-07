# regexfy

### installation 

npm i regexfy

### example

const emailRegex = new RegexBuilder({ startStrict: true })
    .startGroup({
        occurence: RegexGroupBuilderOccurences.ONE_OR_MORE,
    })
    .notIn(RegexBuilderEscapedCharacters.WHITE_SPACE, '@')
    .word()
    .endGroup()
    .startGroup({ occurenceCount: 1 })
    .anyOf('@')
    .endGroup()
    .startGroup({ occurence: RegexGroupBuilderOccurences.ONE_OR_MORE })
    .notIn(RegexBuilderEscapedCharacters.WHITE_SPACE, '@')
    .endGroup()
    .end({ strict: true });

console.log(emailRegex);
console.log(emailRegex.test('test@test.com')); // true
console.log(emailRegex.test('test@test@com')); //false
