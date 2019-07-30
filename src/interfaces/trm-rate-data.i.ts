import { ITrmRateList } from './'

export interface ITrmRateData {
  results: ITrmRateList,
  page: number,
  limit: number,
  total: number,
}
