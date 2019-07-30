/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { iCurrencyCode } from './currency-code.i'

describe('CurrencyCode interface', () => {
    it('should exist', () => {
        expect(iCurrencyCode).to.be.exist
    })

    it('should validate currency code', () => {
        expect(iCurrencyCode('DFT')).to.be.true
    })

    it('should invalidate invalid currency code', () => {
        expect(iCurrencyCode('32')).to.be.false
        expect(iCurrencyCode(32)).to.be.false
        expect(iCurrencyCode('dfg')).to.be.false
        expect(iCurrencyCode('dfG')).to.be.false
        expect(iCurrencyCode('GGGf')).to.be.false
        expect(iCurrencyCode('GGGG')).to.be.false
        expect(iCurrencyCode('GGGAAA')).to.be.false
    })
})
