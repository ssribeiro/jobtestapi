import { ICapitalAlphaChar } from './'

export type ICurrencyCode = [
    ICapitalAlphaChar,
    ICapitalAlphaChar,
    ICapitalAlphaChar
]

export const iCurrencyCode = (arg: any): arg is ICurrencyCode => {
    if (typeof arg !== 'string') {
        return false
    }
    return /^[A-Z]{3}$/g.test(arg)
}
