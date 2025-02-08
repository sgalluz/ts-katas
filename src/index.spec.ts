const sum = (a: number, b: number): number => a + b

describe('sum', () => {
    it('should sum 1 + 2 and return 3', () => expect(sum(1, 2)).toBe(3))
})
