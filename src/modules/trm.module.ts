import * as rpn from 'request-promise-native'
import { error, ITrmRateData, ITrmRateEntry, ITrmRateList, Store } from '../'

import { ICurrencyCode, iCurrencyCode } from '../interfaces/currency-code.i'

export const NO_CURRENCY_CODE_VALIDATION_ERROR =
    'no currency code validation error'
export const RESULTS_OFF_LIMIT_ERROR = 'Results off the limit'
export const TRM_COLLECTION_NAME = 'trm'
export const UNIQUE_WORKING_PERIOD = '30'
export const TRM_API_URI =
    'https://transferwise.com/gb/currency-converter/api/historic'

const validateCurrencyCode = (currencyCodeCandidate: any): ICurrencyCode => {
    if (iCurrencyCode(currencyCodeCandidate)) {
        return currencyCodeCandidate as ICurrencyCode
    }
    throw error.is(NO_CURRENCY_CODE_VALIDATION_ERROR)
}

const updateTablesForCurrency = async (
    source: ICurrencyCode,
    target: ICurrencyCode
) => {
    const options = {
        headers: {
            'User-Agent': 'Request-Promise',
        },
        json: true, // Automatically parses the JSON string in the response
        qs: {
            period: UNIQUE_WORKING_PERIOD,
            source,
            target,
        },
        uri: TRM_API_URI,
    }
    const dataFromServer = (await rpn(options)) as ITrmRateList
    const trmRateEntry: ITrmRateEntry = dataFromServer[0]
    const db = await Store.getDb()
    await db.collection(TRM_COLLECTION_NAME).insertOne(trmRateEntry)
}

const retrievePastStoredRates = async (
    page: number = 0,
    limit: number = 30
): Promise<ITrmRateData> => {
    const db = await Store.getDb()
    const resultsCursor = await db.collection(TRM_COLLECTION_NAME).find()
    const total = await resultsCursor.count()
    if (page * limit > total) {
        throw error.is(RESULTS_OFF_LIMIT_ERROR)
    }
    await resultsCursor.limit(limit)
    await resultsCursor.skip(page * limit)
    const results = (await resultsCursor.toArray()).map(entryDb => {
        const dataEntry: ITrmRateEntry = {
            rate: entryDb.rate,
            source: entryDb.source,
            target: entryDb.target,
            time: entryDb.time,
        }
        return dataEntry
    })
    const data: ITrmRateData = {
        limit,
        page,
        results,
        total,
    }
    return data
}

export const TrmModule = {
    retrievePastStoredRates,
    updateTablesForCurrency,
    validateCurrencyCode,
}
