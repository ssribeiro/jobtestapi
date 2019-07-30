import { error, logger } from '../'

import { ICurrencyCode, iCurrencyCode } from '../interfaces/currency-code.i'

export const NO_CURRENCY_CODE_VALIDATION_ERROR =
    'no currency code validation error'
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
) => {}

export const TrmModule = {
    updateTablesForCurrency,
    validateCurrencyCode,
}
