/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { ICurrencyCode } from '../'
import { NO_CURRENCY_CODE_VALIDATION_ERROR, TrmModule } from './trm.module'

describe('TrmModule', () => {

    it('should validate currency code', () => {
        const currencyCandidates = [
            'VAL',
            'nov',
            'NOVv',
            'nons',
            'XXXAAA',
            'XXX AAA',
            '09X',
            'V@1',
            'OF1',
        ]

        currencyCandidates.forEach(
            (currencyCandidate: string, index: number) => {
                if (index === 0) {
                    expect(TrmModule.validateCurrencyCode(currencyCandidate)).to
                        .be.exist
                } else {
                    let currencyValid: ICurrencyCode | undefined
                    try {
                        currencyValid = TrmModule.validateCurrencyCode(
                            currencyCandidate
                        )
                    } catch (e) {
                        expect(e.message).to.be.equals(
                            NO_CURRENCY_CODE_VALIDATION_ERROR
                        )
                    }
                    expect(currencyValid).to.be.undefined
                }
            }
        )
    })


    it('should update tables for currency', async (done) => {
      await TrmModule.updateTablesForCurrency(
        TrmModule.validateCurrencyCode('USD'),
        TrmModule.validateCurrencyCode('UYU')
      )

    })

})
