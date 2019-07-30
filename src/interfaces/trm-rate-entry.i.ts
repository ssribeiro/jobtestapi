import { ICurrencyCode } from './'

export interface ITrmRateEntry {
  rate: number
  source: ICurrencyCode
  target: ICurrencyCode
  time: string
}
