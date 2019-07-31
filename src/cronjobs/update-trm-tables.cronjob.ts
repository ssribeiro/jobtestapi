import { ICronjob, Trm } from '../'

export const UpdateTrmTablesCronjob: ICronjob = {
    job: async () => {
        await Trm.updateTablesForCurrency(
            Trm.validateCurrencyCode('USD'),
            Trm.validateCurrencyCode('UYU')
        )
    },
    name: 'Update Trm Tables at 07:00 am',
    string: '0 7 * * *',
}
