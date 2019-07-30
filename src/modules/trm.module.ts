import * as rpn from 'request-promise-native'
import { error, ITrmRateEntry, ITrmRateList, logger, Store } from '../'

import { ICurrencyCode, iCurrencyCode } from '../interfaces/currency-code.i'

export const NO_CURRENCY_CODE_VALIDATION_ERROR =
    'no currency code validation error'
export const TRM_COLLECTION_NAME = 'trm'
export const UNIQUE_WORKING_PERIOD = '30'
export const TRM_API_URI =
    'https://transferwise.com/gb/currency-converter/api/historic'

/*
interface ITrmModuleState {
}

const state: ITrmModuleState = {
}
*/

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

export const TrmModule = {
    updateTablesForCurrency,
    validateCurrencyCode,
}
