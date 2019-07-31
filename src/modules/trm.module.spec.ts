/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import * as rpn from 'request-promise-native'

import { ICurrencyCode, Service, Store } from '../'
import {
    NO_CURRENCY_CODE_VALIDATION_ERROR,
    TRM_COLLECTION_NAME,
    TrmModule,
} from './trm.module'

describe('TrmModule', () => {
    after(done => {
        Service.stop().then(done)
    })

    const sampleSourceCurrencyCode = 'USD'
    const sampleTargetCurrencyCode = 'UYU'

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

    it('should update tables for currency', async () => {
        const options = {
            headers: {
                'User-Agent': 'Request-Promise',
            },
            json: true, // Automatically parses the JSON string in the response
            qs: {
                period: '30',
                source: sampleSourceCurrencyCode,
                target: sampleTargetCurrencyCode,
            },
            uri: 'https://transferwise.com/gb/currency-converter/api/historic',
        }
        await TrmModule.updateTablesForCurrency(
            TrmModule.validateCurrencyCode(options.qs.source),
            TrmModule.validateCurrencyCode(options.qs.target)
        )
        const dataFromServer = await rpn(options)
        const trmRateGot = dataFromServer[0].rate
        const db = await Store.getDb()
        const storedValue = await db
            .collection(TRM_COLLECTION_NAME)
            .findOne({ source: options.qs.source, target: options.qs.target })
        expect(storedValue).to.be.exist
        expect(storedValue.rate).to.be.equals(trmRateGot)
    }).timeout(5000)

    it('should retrieve trm currency data', async () => {
        const trmRateData = await TrmModule.retrievePastStoredRates()
        expect(trmRateData).to.be.exist
        expect(trmRateData.limit).to.be.equals(30)
        expect(trmRateData.page).to.be.equals(0)
        expect(trmRateData.results).to.be.an('array')
        expect(trmRateData.results[0].source).to.be.equal(
            sampleSourceCurrencyCode
        )
        expect(trmRateData.results[0].target).to.be.equal(
            sampleTargetCurrencyCode
        )
        expect(trmRateData.results[0].rate).to.be.an('number')
    }).timeout(5000)
})
