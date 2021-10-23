import { evaluateComparison, evaluateLogical } from './evaluate'

describe('evaluateComparison', () => {
  it('should consider "Briza" equal to "Briza"', () => {
    expect(evaluateComparison(['==', 'Briza', 'Briza'])).toBeTruthy()
  })

  it('should consider "Briza" different from "briza"', () => {
    expect(evaluateComparison(['==', 'Briza', 'briza'])).toBeFalsy()
  })

  it('should consider 10 equal to 10', () => {
    expect(evaluateComparison(['==', 10, 10])).toBeTruthy()
  })

  it('should not consider "10" equal to 10', () => {
    expect(evaluateComparison(['==', '10', 10])).toBeFalsy()
  })


  describe('with variables', () => {
    it('should consider "$value" equal to "Briza"', () => {
      expect(
        evaluateComparison(['==', '$value', 'Briza'], { value: 'Briza' })
      ).toBeTruthy()
    })

    it('should consider "$value" equal to 10', () => {
      expect(
        evaluateComparison(['==', '$value', 10], { value: 10 })
      ).toBeTruthy()
    })

    it('should consider 10 equal to "$value"', () => {
      expect(
        evaluateComparison(['==', 10, '$value'], { value: 10 })
      ).toBeTruthy()
    })

    it('should not consider 10 equal to "$value"', () => {
      expect(
        evaluateComparison(['==', 10, '$data'], { data: 20 })
      ).toBeFalsy()
    })

    it('should consider "$a" equal to "$b"', () => {
      expect(
        evaluateComparison(['==', '$a', '$b'], { a: 10, b: 10 })
      ).toBeTruthy()
    })

    it('should consider "$a" equal to "$b"', () => {
      expect(
        evaluateComparison(['==', '$a', '$b'], { a: 10, b: 10 })
      ).toBeTruthy()
    })

    it('should consider "$a" equal to "$b"', () => {
      expect(
        evaluateComparison(['==', '$luiz', '$andrew'], { luiz: 10, andrew: 10 })
      ).toBeTruthy()
    })

    it('should consider "$a" equal to "$b"', () => {
      expect(
        evaluateComparison(['==', 'lui$', '$andrew'], { andrew: 'lui$' })
      ).toBeTruthy()
    })

    it('should not consider "$" equal to 10', () => {
      expect(evaluateComparison(['==', '$', 10], { ['']: 10 })).toBeFalsy()
    })

    it('should not consider "$a" equal to "$b" when "$b" is not found in context', () => {
      expect(evaluateComparison(['==', '$a', '$b'], { a: 10 })).toBeFalsy()
    })

    it('should consider "$a" equal to "$b" when both are not found in context', () => {
      expect(evaluateComparison(['==', '$a', '$b'], {})).toBeTruthy()
    })

    it('should consider "$" equal to "$value" when $value is "$"', () => {
      expect(
        evaluateComparison(['==', '$', '$value'], { value: '$' })
      ).toBeTruthy()
    })


  })
})


describe('evaluateLogical', () => {
  describe('AND', () => {
    it('should return true when all comparisons are true', () => {
      expect(
        evaluateLogical(['AND', ['==', 10, 10], ['==', 'Briza', 'Briza']], {})
      ).toBeTruthy()
    })

    it('should return false when all comparisons are false', () => {
      expect(
        evaluateLogical(['AND', ['==', 10, 20], ['==', 'Briza', 'briza']], {})
      ).toBeFalsy()
    })

    it('should return false when the first comparison is false', () => {
      expect(
        evaluateLogical(['AND', ['==', 10, 20], ['==', 'Briza', 'Briza']], {})
      ).toBeFalsy()
    })

    it('should return false when the second comparison is false', () => {
      expect(
        evaluateLogical(['AND', ['==', 10, 10], ['==', 'Briza', 'briza']], {})
      ).toBeFalsy()
    })

    it('should return true when no comparisons are provided', () => {
      expect(evaluateLogical(['AND'], {})).toBeTruthy()
    })

    it('should return true with conditions referencing the context', () => {
      expect(
        evaluateLogical(['AND', ['==', 10, '$b'], ['==', '$a', 'Briza']], {
          a: 'Briza',
          b: 10,
        })
      ).toBeTruthy()
    })

    it('should return false with conditions referencing the context', () => {
      expect(
        evaluateLogical(['AND', ['==', 10, '$b'], ['==', '$a', 'Briza']], {
          a: 'Briza',
          b: 20,
        })
      ).toBeFalsy()
    })

    it('should return false with multiple expressions', () => {
      expect(
        evaluateLogical(
          ['AND', ['==', 10, 10], ['==', 'Briza', 'Briza'], ['==', 2, 1]],
          {}
        )
      ).toBeFalsy()
    })
  })

  describe('OR', () => {
    it('should return true when all comparisons are true', () => {
      expect(
        evaluateLogical(['OR', ['==', 10, 10], ['==', 'Briza', 'Briza']], {})
      ).toBeTruthy()
    })

    it('should return false when all comparisons are false', () => {
      expect(
        evaluateLogical(['OR', ['==', 10, 20], ['==', 'Briza', 'briza']], {})
      ).toBeFalsy()
    })

    it('should return true when the first comparison is false', () => {
      expect(
        evaluateLogical(['OR', ['==', 10, 20], ['==', 'Briza', 'Briza']], {})
      ).toBeTruthy()
    })

    it('should return true when the second comparison is false', () => {
      expect(
        evaluateLogical(['OR', ['==', 10, 20], ['==', 'Briza', 'Briza']], {})
      ).toBeTruthy()
    })

    it('should return false when no comparisons are provided', () => {
      expect(evaluateLogical(['OR'], {})).toBeFalsy()
    })

    it('should return true with conditions referencing the context', () => {
      expect(
        evaluateLogical(['OR', ['==', 10, '$b'], ['==', '$a', 'Briza']], {
          a: 'Briza',
          b: 10,
        })
      ).toBeTruthy()
    })

    it('should return false with conditions referencing the context', () => {
      expect(
        evaluateLogical(['OR', ['==', 10, '$b'], ['==', '$a', 'Briza']], {
          a: 'briza',
          b: 20,
        })
      ).toBeFalsy()
    })

    it('should return false with multiple expressions', () => {
      expect(
        evaluateLogical(
          ['OR', ['==', 10, 20], ['==', 'Briza', 'briza'], ['==', 2, 2]],
          {}
        )
      ).toBeTruthy()
    })
  })
})
