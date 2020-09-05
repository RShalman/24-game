const OPERATORS = ['+', '-', '*', '/']
const LETTERS = ['a', 'b', 'c', 'd']
const BRACKET_PATTERNS = ['a1b2c3d', '(a1b)2c3d', '(a1b2c)3d', 'a1(b2c3d)', 'a1b2(c3d)', '((a1b)2c)3d', '(a1(b2c))3d', '(a1b)2(c3d)', 'a1((b2c)3d)', 'a1(b2(c3d))']

function addOperator(variant, option, len) {
    const isLast = variant.length + 1 === len
    let state = OPERATORS.map(op => isLast ? [...variant, op] : addOperator(isNaN(option) ? [...variant, option] : variant, op, len))
    return isLast ? state : state.flat()
}

function removeDuplicates(arr) {
    return [...new Set(arr.map(x => `${x}`))].map(y => y.split(','))
}

function getOperatorsCombinations() {
    const arrOfCombinations = [...Array(3).keys()].map(x => addOperator([],x, 3)).flat()
    return removeDuplicates(arrOfCombinations)
}

function getCombinationsWithBrackets() {
    const arr = getOperatorsCombinations()
    const splittedPatterns = BRACKET_PATTERNS.map(x => x.split(''))
    const lettersOptions = getCombinationsOfLetters()

    const combinationsWithOperators = arr.map(combination => {

        const withOps = splittedPatterns.map(pattern => {
            let newPattern = [...pattern]
            const idxs = combination.map((_, idx) => pattern.findIndex(p => p === idx + 1))
            idxs.forEach((el, i) => newPattern[el] = combination[i])

            const [a,b,c,d] = LETTERS.map(el => newPattern.findIndex(l => l === el))

            const patternWithCombinations = lettersOptions.map(option => {
                const [oA, oB, oC, oD] = option
                let newPatternCopy = [...newPattern]
                newPatternCopy[a] = oA
                newPatternCopy[b] = oB
                newPatternCopy[c] = oC
                newPatternCopy[d] = oD

                return newPatternCopy.join('')
            })

            return patternWithCombinations
        })

        return withOps.flat()
    })

    return combinationsWithOperators.flat()
}

function getCombinationsOfLetters() {
    let arrOfCombinations = []

    for(let i = 0; i < LETTERS.length; i++) {
        let optionArr = [LETTERS[i]]
        const arrOfLetters = LETTERS.filter(l => l !== LETTERS[i])
        combinations(optionArr, arrOfLetters)
    }

    function combinations(arr, arrOfLetters) {
        for(let i = 0; i < arrOfLetters.length; i++) {
            const nextArr = [...arr, arrOfLetters[i]]
            if(nextArr.length === LETTERS.length) {
                arrOfCombinations.push(nextArr)
                break;
            } else {
                const nextArrOfLetters = arrOfLetters.filter(l => l !== arrOfLetters[i])
                combinations(nextArr, nextArrOfLetters)
            }
        }
    }

    return arrOfCombinations
}

function solve24 (numStr) {
    const nums = numStr.split('')

    const arrOfOptions = getCombinationsWithBrackets();
    const optsWithNums = arrOfOptions.map(option => {
        const [a,b,c,d] = LETTERS.map(el => option.split('').findIndex(l => l === el))
        const [oA, oB, oC, oD] = nums
        let optionsWithNums = [...option]
        optionsWithNums[a] = oA
        optionsWithNums[b] = oB
        optionsWithNums[c] = oC
        optionsWithNums[d] = oD
        optionsWithNums = optionsWithNums.join('')
        return optionsWithNums
    })
    const result = optsWithNums.find(option => eval(option) === 24)

    return result ? result : 'Nope';
}

export default solve24